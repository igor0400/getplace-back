import {
  Injectable,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { ReservationOrderRepository } from './repositories/reservation-order.repository';
import { ReservationOrderDishRepository } from './repositories/reservation-order-dish.repository';
import { CreateOrderDto } from './dto/create-order.dto';
import { CreateReservationOrderDto } from './dto/create-reservation-order.dto';
import { CreateReservationOrderDishDto } from './dto/create-reservation-order-dish.dto';
import { TableReservationUserRepository } from 'src/tables/repositories/reservation-user.repository';
import { ChangeReservationOrderDishDto } from './dto/change-reservation-order-dish.dto';
import { DeleteReservationOrderDishDto } from './dto/delete-reservation-order-dish.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly reservationOrderRepository: ReservationOrderRepository,
    private readonly reservationOrderDishRepository: ReservationOrderDishRepository,
    private readonly tableReservationUserRepository: TableReservationUserRepository,
  ) {}

  async createOrder(dto: CreateOrderDto) {
    const args = {
      ...dto,
      number: String(1000000000 + Math.floor(Math.random() * 10000000000)),
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

    const reservationOrderDish =
      await this.reservationOrderDishRepository.create({
        dishId,
        userId,
        reservationUserId: reservationUser.id,
        reservationOrderId: reservationOrder.id,
      });

    return reservationOrderDish;
  }

  async changeReservationOrderDish(dto: ChangeReservationOrderDishDto) {
    const { reservationOrderDishId, userId } = dto;

    await this.isUserCanChangeDish(
      reservationOrderDishId,
      userId,
      'У вас не достаточно прав на изменение блюда',
    );

    const reservationOrderDish =
      await this.reservationOrderDishRepository.findByPk(
        reservationOrderDishId,
      );

    for (let item in dto) {
      if (reservationOrderDish[item]) {
        reservationOrderDish[item] = dto[item];
      }
    }

    return reservationOrderDish.save();
  }

  async deleteReservationOrderDishById(dto: DeleteReservationOrderDishDto) {
    const { reservationOrderDishId, userId } = dto;

    await this.isUserCanChangeDish(
      reservationOrderDishId,
      userId,
      'У вас не достаточно прав на удаление блюда',
    );

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
