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
import { Status } from 'src/statuses/models/status.model';
import { TableReservationUserRepository } from 'src/reservations/repositories/reservation-user.repository';
import { ReservationOrderDish } from './models/reservation-order-dish.model';
import { Order } from './models/order.model';
import { ReservationOrderPayment } from 'src/payments/models/reservation-order-payment.model';
import { PaymentsService } from 'src/payments/payments.service';
import { PayReservationOrderDto } from 'src/payments/dto/pay-reservation-order.dto';

const ordersInclude = [Status];
const reservationOrdersInclude = [
  ReservationOrderDish,
  { model: Order, include: [Status] },
  ReservationOrderPayment,
];

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly reservationOrderRepository: ReservationOrderRepository,
    private readonly reservationOrderDishRepository: ReservationOrderDishRepository,
    private readonly tableReservationUserRepository: TableReservationUserRepository,
    private readonly dishesService: DishesService,
    @Inject(forwardRef(() => PaymentsService))
    private readonly paymentsService: PaymentsService,
  ) {}

  async getAllOrders(limit: number, offset: number) {
    const tables = await this.orderRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      include: ordersInclude,
    });

    return tables;
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findByPk(id, {
      include: ordersInclude,
    });

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

    order.status = 'PAID';
    order.save();

    return orderPayment;
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
