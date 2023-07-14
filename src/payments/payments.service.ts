import {
  Injectable,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { uid } from 'uid';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ReservationOrderPaymentUserRepository } from './repositories/reservation-order-payment-user.repository';
import { ReservationOrderPaymentRepository } from './repositories/reservation-order-payment.repository';
import { PayReservationOrderDto } from './dto/pay-reservation-order.dto';
import { ReservationsService } from 'src/reservations/reservations.service';
import { OrdersService } from 'src/orders/orders.service';
import { TableReservationUserRepository } from 'src/reservations/repositories/reservation-user.repository';
import { ReservationOrderPaymentUser } from './models/reservation-order-payment-user.model';
import { ReferalsService } from 'src/referals/referals.service';
import { BonusesService } from 'src/bonuses/bonuses.service';
import { PlacesService } from 'src/places/places.service';
import { PromotionRepository } from 'src/promotions/repositories/promotion.repository';
import { Op } from 'sequelize';
import { Promotion } from 'src/promotions/models/promotion.model';
import { PromotionVisitTime } from 'src/promotions/models/visit-time.model';
import { PromotionsService } from 'src/promotions/promotions.service';

const reservationOrderPaymentInclude = [ReservationOrderPaymentUser];

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly reservationOrderPaymentRepository: ReservationOrderPaymentRepository,
    private readonly reservationOrderPaymentUserRepository: ReservationOrderPaymentUserRepository,
    private readonly reservationUserRepository: TableReservationUserRepository,
    private readonly promotionRepository: PromotionRepository,
    private readonly reservationsService: ReservationsService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly referalsService: ReferalsService,
    private readonly bonusesService: BonusesService,
    private readonly placesService: PlacesService,
    private readonly promotionsService: PromotionsService,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const initialAmount = dto.initialAmount ?? '0';
    const discountProcent = dto.discountProcent ?? '0';

    const discountAmount = ((+initialAmount * +discountProcent) / 100).toFixed(
      2,
    );
    const totalAmount = String(+initialAmount - +discountAmount);

    const payment = await this.paymentRepository.create({
      ...dto,
      shortId: uid(20).toUpperCase(),
      initialAmount,
      discountProcent,
      discountAmount,
      totalAmount,
    });

    // тут подключить оплату (сделать отдельную модель для ioka и stripe, относится к paymentModel)

    return payment;
  }

  async getReservationOrderPaymentById(id: string) {
    const orderPayment = await this.reservationOrderPaymentRepository.findByPk(
      id,
      {
        include: reservationOrderPaymentInclude,
      },
    );

    return orderPayment;
  }

  async payReservationOrder(dto: PayReservationOrderDto) {
    const { reservationOrderId, type, userId } = dto;
    const reservationOrder = await this.ordersService.getReservationOrderById(
      reservationOrderId,
    );

    if (!reservationOrder)
      throw new BadRequestException('Заказ брони не найден');

    const reservation = await this.reservationsService.getReservationById(
      reservationOrder.reservationId,
    );
    const place = await this.placesService.getPlaceByTableId(
      reservation.tableId,
    );

    const totalAmount = +reservationOrder?.orderData?.totalPrice;

    const discountProcent = await this.getPlaceOrderDiscount({
      placeId: place.id,
      amount: String(totalAmount),
      reservationId: reservation.id,
      userId,
    });
    const discountTotalAmount = +(
      (totalAmount * +discountProcent) /
      100
    ).toFixed(2);
    const totalAmountWithDisc = +(totalAmount - discountTotalAmount).toFixed(2);

    const orderPayment = await this.reservationOrderPaymentRepository.create({
      ...dto,
      initialAmount: String(totalAmount),
      discountProcent,
      discountAmount: String(discountTotalAmount),
      totalAmount: String(totalAmountWithDisc),
      currency: 'KZT',
    });

    if (type === 'oneForAll') {
      const owner = await this.reservationUserRepository.findOne({
        where: {
          reservationId: reservation.id,
          role: 'owner',
        },
      });

      await this.createUserPayment({
        amount: String(totalAmount),
        discountProcent,
        userId: owner.userId,
        orderPaymentId: orderPayment.id,
        placeId: place.id,
      });
    } else {
      const users = await this.reservationUserRepository.findAll({
        where: {
          reservationId: reservation.id,
        },
      });

      const userAmount = Math.floor(totalAmountWithDisc / users.length);
      const ownerAmount =
        userAmount + (totalAmountWithDisc - userAmount * users.length);

      for (let { userId, role } of users) {
        await this.createUserPayment({
          amount: role === 'owner' ? String(ownerAmount) : String(userAmount),
          userId,
          orderPaymentId: orderPayment.id,
          placeId: place.id,
        });
      }
    }

    return this.getReservationOrderPaymentById(orderPayment.id);
  }

  private async createUserPayment(dto: {
    amount: string;
    discountProcent?: string;
    userId: string;
    orderPaymentId: string;
    placeId: string;
  }) {
    const { amount, discountProcent, userId, orderPaymentId, placeId } = dto;

    const payment = await this.createPayment({
      initialAmount: amount,
      discountProcent,
      currency: 'KZT',
    });

    await this.reservationOrderPaymentUserRepository.create({
      userId,
      reservationOrderPaymentId: orderPaymentId,
      paymentId: payment.id,
      placeId,
    });

    const userReferals = await this.referalsService.getReferalsByUserId(userId);
    if (userReferals) {
      const referalProcent = userReferals?.inviter[0]?.referals?.referalProcent;
      const inviterId = userReferals?.inviter[0].id;
      const bonusesAmount = String(
        Math.floor((referalProcent * +amount) / 100),
      );

      await this.bonusesService.addUserBonusesBalance({
        userId: inviterId,
        amount: bonusesAmount,
      });
    }
  }

  private async getPlaceOrderDiscount(dto: {
    placeId: string;
    amount: string;
    userId: string;
    reservationId: string;
  }) {
    const { placeId, amount, userId, reservationId } = dto;
    let discount = 0;

    const promotions = await this.promotionRepository.findAll({
      where: {
        placeId,
        type: 'discount',
      },
      include: [PromotionVisitTime],
    });

    for (let promotion of promotions) {
      const { type, actionType, buyFromAmount, discountProcent } = promotion;

      if (type !== 'discount') continue;

      if (actionType === 'buyFrom' && +amount >= +buyFromAmount) {
        discount += +discountProcent;
      }

      if (actionType === 'firstVisit') {
        const isVisit = await this.reservationUserRepository.findOne({
          where: {
            userId,
            reservationId: {
              [Op.not]: reservationId,
            },
          },
        });

        if (!isVisit) {
          discount += +discountProcent;
        }
      }

      if (actionType === 'visitFromTill') {
        const { nowParse, fromParse, tillParse } =
          this.promotionsService.getPromotionVisitDates(promotion);

        if (nowParse > fromParse && nowParse < tillParse) {
          discount += +discountProcent;
        }
      }
    }

    return String(discount);
  }
}
