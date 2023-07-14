import {
  Injectable,
  BadRequestException,
  BadGatewayException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { ReservationOrderRepository } from './repositories/reservation-order.repository';
import { ReservationOrderDishRepository } from './repositories/reservation-order-dish.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateReservationOrderDto } from './dto/create-reservation-order.dto';
import { CreateReservationOrderDishDto } from './dto/create-reservation-order-dish.dto';
import { DeleteReservationOrderDishDto } from './dto/delete-reservation-order-dish.dto';
import { DishesService } from 'src/dishes/dishes.service';
import { TableReservationUserRepository } from 'src/reservations/repositories/reservation-user.repository';
import { ReservationOrderDish } from './models/reservation-order-dish.model';
import { Order } from './models/order.model';
import { ReservationOrderPayment } from 'src/payments/models/reservation-order-payment.model';
import { PaymentsService } from 'src/payments/payments.service';
import { PayReservationOrderDto } from 'src/payments/dto/pay-reservation-order.dto';
import { ReservationOrder } from './models/reservation-order.model';
import { PlacesService } from 'src/places/places.service';
import { PromotionProduct } from 'src/promotions/models/product.model';
import { Dish } from 'src/dishes/models/dish.model';
import { PromotionRepository } from 'src/promotions/repositories/promotion.repository';
import { PromotionsService } from 'src/promotions/promotions.service';
import { Op } from 'sequelize';

const reservationOrdersInclude = [
  ReservationOrderDish,
  { model: Order },
  ReservationOrderPayment,
];

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly reservationOrderRepository: ReservationOrderRepository,
    private readonly reservationOrderDishRepository: ReservationOrderDishRepository,
    private readonly tableReservationUserRepository: TableReservationUserRepository,
    private readonly promotionRepository: PromotionRepository,
    private readonly dishesService: DishesService,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
    private readonly placesService: PlacesService,
    private readonly promotionsService: PromotionsService,
  ) {}

  async getAllOrders(limit: number, offset: number) {
    const tables = await this.orderRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
    });

    return tables;
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findByPk(id);

    return order;
  }

  async getReservationOrderById(id: string) {
    const order = await this.reservationOrderRepository.findByPk(id, {
      include: reservationOrdersInclude,
    });

    return order;
  }

  async createOrder(dto: CreateOrderDto) {
    const args = {
      ...dto,
      number: String(1000000000 + Math.floor(Math.random() * 1000000000)),
    };
    const order = await this.orderRepository.create(args);

    return order;
  }

  async createReservationOrder(dto: CreateReservationOrderDto) {
    const order = await this.createOrder({ type: 'reservation' });
    const reservationOrder = await this.reservationOrderRepository.create({
      ...dto,
      orderId: order.id,
    });

    return reservationOrder;
  }

  async findOrCreateReservationOrder(reservationId: string) {
    const reservationOrder = await this.reservationOrderRepository.findOne({
      where: {
        reservationId,
      },
    });

    if (reservationOrder) return reservationOrder;

    return this.createReservationOrder({ reservationId });
  }

  async createReservationOrderDish(dto: CreateReservationOrderDishDto) {
    const { reservationId, userId, dishId } = dto;

    const reservationUser = await this.tableReservationUserRepository.findOne({
      where: {
        reservationId,
        userId,
      },
    });

    if (!reservationUser) {
      throw new BadRequestException('Пользователь в бронировании не найден');
    }

    const reservationOrder = await this.findOrCreateReservationOrder(
      reservationId,
    );
    const dish = await this.dishesService.getDishById(dishId);
    const order = await this.orderRepository.findByPk(reservationOrder.orderId);
    order.totalPrice = String(+order.totalPrice + +dish.cost);
    order.save();

    const reservationOrderDish =
      await this.reservationOrderDishRepository.create({
        dishId,
        userId,
        reservationUserId: reservationUser.id,
        reservationOrderId: reservationOrder.id,
      });

    return reservationOrderDish;
  }

  async payReservationOrder(dto: PayReservationOrderDto) {
    const { reservationOrderId, userId } = dto;
    const reservationOrder = await this.getReservationOrderById(
      reservationOrderId,
    );
    const owner = await this.tableReservationUserRepository.findOne({
      where: {
        userId,
        reservationId: reservationOrder.reservationId,
        role: 'owner',
      },
    });

    if (!owner) {
      throw new BadRequestException('У вас нет прав на оплату заказа');
    }

    const orderPayment = await this.paymentsService.payReservationOrder(dto);
    const order = await this.getOrderById(reservationOrder.orderId);

    const freeDishes = await this.getFreeDishes(reservationOrder, userId);

    order.status = 'PAID';
    order.save();

    return { orderPayment, freeDishes };
  }

  async deleteReservationOrderDishById(dto: DeleteReservationOrderDishDto) {
    const { reservationOrderDishId, userId } = dto;

    await this.isUserCanChangeDish(
      reservationOrderDishId,
      userId,
      'У вас не достаточно прав на удаление блюда',
    );

    const { order, dish } = await this.getDishAndOrderByDishId(
      reservationOrderDishId,
    );
    order.totalPrice = String(+order.totalPrice - +dish.cost);
    order.save();

    const deleteCount = await this.reservationOrderDishRepository.destroy({
      where: {
        id: reservationOrderDishId,
      },
    });

    if (deleteCount > 0) {
      const { reservationOrderId } =
        await this.reservationOrderDishRepository.findByPk(
          reservationOrderDishId,
        );
      const { reservationId } = await this.reservationOrderRepository.findByPk(
        reservationOrderId,
      );

      return {
        reservationOrderDishId,
        reservationOrderId,
        reservationId,
        isDeleted: true,
      };
    }

    return false;
  }

  private async getFreeDishes(
    reservationOrder: ReservationOrder,
    userId: string,
  ) {
    const dishes = [];

    const { orderId, reservationId } = reservationOrder;
    const order = await this.getOrderById(orderId);
    const place = await this.placesService.getPlaceByReservationId(
      reservationId,
    );
    const promotions = await this.promotionRepository.findAll({
      where: {
        placeId: place.id,
        type: 'freeProduct',
      },
      include: [{ model: PromotionProduct, include: [Dish] }],
    });

    for (let promotion of promotions) {
      const { type, actionType, buyFromAmount, freeProduct } = promotion;

      if (type !== 'freeProduct') continue;

      if (actionType === 'buyFrom' && +order.totalPrice >= +buyFromAmount) {
        dishes.push(freeProduct);
      }

      if (actionType === 'firstVisit') {
        const isVisit = await this.tableReservationUserRepository.findOne({
          where: {
            userId,
            reservationId: {
              [Op.not]: reservationId,
            },
          },
        });

        if (!isVisit) {
          dishes.push(freeProduct);
        }
      }

      if (actionType === 'visitFromTill') {
        const { nowParse, fromParse, tillParse } =
          this.promotionsService.getPromotionVisitDates(promotion);

        if (nowParse > fromParse && nowParse < tillParse) {
          dishes.push(freeProduct);
        }
      }
    }

    return dishes;
  }

  private async getDishAndOrderByDishId(reservationOrderDishId: string) {
    const reservationOrderDish =
      await this.reservationOrderDishRepository.findByPk(
        reservationOrderDishId,
      );
    const dish = await this.dishesService.getDishById(
      reservationOrderDish.dishId,
    );
    const { orderId } = await this.reservationOrderRepository.findByPk(
      reservationOrderDish.reservationOrderId,
    );
    const order = await this.orderRepository.findByPk(orderId);

    return { dish, order };
  }

  private async isUserCanChangeDish(
    reservationOrderDishId: string,
    userId: string,
    message: string,
  ) {
    const reservationOrderDish =
      await this.reservationOrderDishRepository.findByPk(
        reservationOrderDishId,
      );

    if (!reservationOrderDish) {
      throw new BadRequestException('Блюдо не найдено');
    }

    const reservationOrder = await this.reservationOrderRepository.findByPk(
      reservationOrderDish.reservationOrderId,
    );

    const reservationUser = await this.tableReservationUserRepository.findOne({
      where: {
        reservationId: reservationOrder.reservationId,
        userId,
      },
    });

    if (
      reservationUser.role !== 'owner' &&
      reservationOrderDish.userId !== userId
    ) {
      throw new BadGatewayException(message);
    }

    return true;
  }
}
