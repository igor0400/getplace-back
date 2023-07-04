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

const reservationOrderPaymentInclude = [ReservationOrderPaymentUser];

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly reservationOrderPaymentRepository: ReservationOrderPaymentRepository,
    private readonly reservationOrderPaymentUserRepository: ReservationOrderPaymentUserRepository,
    private readonly reservationUserRepository: TableReservationUserRepository,
    private readonly reservationsService: ReservationsService,
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
    private readonly referalsService: ReferalsService,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const payment = await this.paymentRepository.create({
      ...dto,
      shortId: uid(20).toUpperCase(),
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
    const { reservationOrderId, type } = dto;
    const reservationOrder = await this.ordersService.getReservationOrderById(
      reservationOrderId,
    );

    if (!reservationOrder)
      throw new BadRequestException('Заказ брони не найден');

    const reservation = await this.reservationsService.getReservationById(
      reservationOrder.reservationId,
    );

    const orderPayment = await this.reservationOrderPaymentRepository.create(
      dto,
    );

    if (type === 'eachForHimself') {
      const owner = await this.reservationUserRepository.findOne({
        where: {
          reservationId: reservation.id,
          role: 'owner',
        },
      });

      await this.createUserPayment({
        amount: reservationOrder?.orderData?.totalPrice,
        userId: owner.userId,
        orderPaymentId: orderPayment.id,
      });
    } else {
      const users = await this.reservationUserRepository.findAll({
        where: {
          reservationId: reservation.id,
        },
      });
      const totalAmount = +reservationOrder?.orderData?.totalPrice;
      const userAmount = Math.floor(totalAmount / users.length);
      const ownerAmount =
        userAmount + (totalAmount - userAmount * users.length);

      for (let { userId, role } of users) {
        await this.createUserPayment({
          amount: role === 'owner' ? String(ownerAmount) : String(userAmount),
          userId,
          orderPaymentId: orderPayment.id,
        });
      }
    }

    return this.getReservationOrderPaymentById(orderPayment.id);
  }

  private async createUserPayment(dto: {
    amount: string;
    userId: string;
    orderPaymentId: string;
  }) {
    const { amount, userId, orderPaymentId } = dto;
    const payment = await this.createPayment({
      amount: amount ?? '0',
      currency: 'KZT',
    });

    await this.reservationOrderPaymentUserRepository.create({
      userId,
      reservationOrderPaymentId: orderPaymentId,
      paymentId: payment.id,
    });

    const userReferals = await this.referalsService.getReferalsByUserId(userId);
    if (userReferals) {
      const referalProcent = userReferals?.inviter[0]?.referals?.referalProcent;
      const bonusesAmount = Math.floor((referalProcent * +amount) / 100);

      // начислять реферальные бонусы при оплате
      // сделать bonuses модуль и начислять туда как валюту приложения bonusesAmount (если надо передавать строкой)
    }
  }
}
