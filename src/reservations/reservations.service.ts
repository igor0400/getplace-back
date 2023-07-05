import { Injectable, BadRequestException } from '@nestjs/common';
import { TableReservationRepository } from './repositories/reservation.repository';
import { TableReservationUserRepository } from './repositories/reservation-user.repository';
import { TableReservationInviteRepository } from './repositories/reservation-invite.repository';
import { TableReservationUser } from './model/table-reservation-user.model';
import { User } from 'src/users/models/user.model';
import { Seat } from 'src/seats/models/seat.model';
import { ReservationOrder } from 'src/orders/models/reservation-order.model';
import { Order } from 'src/orders/models/order.model';
import { ReservationOrderDish } from 'src/orders/models/reservation-order-dish.model';
import { Dish } from 'src/dishes/models/dish.model';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ChangeReservationDto } from './dto/change-reservation.dto';
import { InviteReservationUserDto } from './dto/invite-reservation-user.dto';
import { ReplyReservationInviteDto } from './dto/reply-reservation-invite.dto';
import { CreateTableReservationUserSeatDto } from './dto/create-reservation-user-seat.dto';
import { SeatsService } from 'src/seats/seats.service';
import { StatsService } from 'src/stats/stats.service';
import { PlacesService } from 'src/places/places.service';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { Op } from 'sequelize';
import { getPeriodValues } from 'src/common';
import { ReservationOrderPayment } from 'src/payments/models/reservation-order-payment.model';
import { ReservationOrderPaymentUser } from 'src/payments/models/reservation-order-payment-user.model';
import { Payment } from 'src/payments/models/payment.model';

const reservationInclude = [
  { model: TableReservationUser, include: [User, Seat] },
  {
    model: ReservationOrder,
    include: [
      Order,
      { model: ReservationOrderDish, include: [TableReservationUser, Dish] },
      {
        model: ReservationOrderPayment,
        include: [{ model: ReservationOrderPaymentUser, include: [Payment] }],
      },
    ],
  },
];

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: TableReservationRepository,
    private readonly reservationUserRepository: TableReservationUserRepository,
    private readonly reservationInviteRepository: TableReservationInviteRepository,
    private readonly seatsService: SeatsService,
    private readonly statsService: StatsService,
    private readonly placesService: PlacesService,
  ) {}

  async getAllReservations(limit: number, offset: number) {
    const reservations = await this.reservationRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      include: reservationInclude,
      order: ['createdAt'],
    });

    return reservations;
  }

  async getReservationById(id: string) {
    const reservation = await this.reservationRepository.findByPk(id, {
      include: reservationInclude,
    });

    return reservation;
  }

  async createReservation(dto: CreateReservationDto) {
    const { tableId, userId, startDate, endDate } = dto;
    const place = await this.placesService.getPlaceByTableId(tableId);

    await this.validateReservationDate(tableId, startDate, endDate);

    const reservation = await this.reservationRepository.create(dto);
    await this.reservationUserRepository.create({
      reservationId: reservation.id,
      userId,
      role: 'owner',
    });
    await this.statsService.createPlaceGuest({
      placeId: place.id,
      guestId: userId,
      startDate,
      endDate,
    });

    return this.getReservationById(reservation.id);
  }

  async changeReservation(dto: ChangeReservationDto) {
    const { reservationId, userId } = dto;
    const reservation = await this.getReservationById(reservationId);
    const user = await this.reservationUserRepository.findOne({
      where: {
        reservationId,
        userId,
        role: 'owner',
      },
    });

    if (!user) {
      throw new BadRequestException('У вас нет доступа к этой брони');
    }

    for (let item in dto) {
      if (reservation[item]) {
        if (item === 'startDate') {
          await this.validateReservationDate(
            reservation.tableId,
            dto[item],
            reservation.endDate,
            reservation.id,
          );
          reservation[item] = dto[item];
        } else if (item == 'endDate') {
          await this.validateReservationDate(
            reservation.tableId,
            reservation.startDate,
            dto[item],
            reservation.id,
          );
          reservation[item] = dto[item];
        } else {
          reservation[item] = dto[item];
        }
      }
    }

    return reservation.save();
  }

  async cancelReservation(dto: CancelReservationDto) {
    const { reservationId, userId } = dto;
    const reservation = await this.getReservationById(reservationId);
    const user = await this.reservationUserRepository.findOne({
      where: {
        reservationId,
        userId,
        role: 'owner',
      },
    });

    if (!user) {
      throw new BadRequestException('У вас нет доступа к этой брони');
    }

    const place = await this.placesService.getPlaceByTableId(
      reservation.tableId,
    );
    const users = await this.reservationUserRepository.findAll({
      where: {
        reservationId,
      },
    });

    for (let { userId } of users) {
      await this.statsService.deletePlaceGuest({
        placeId: place.id,
        guestId: userId,
        startDate: reservation.startDate,
        endDate: reservation.endDate,
      });
    }

    reservation.status = 'CANCELLED';
    return reservation.save();
  }

  async createReservationUserInvite(dto: InviteReservationUserDto) {
    const { reservationId, inviterId } = dto;

    const owner = await this.reservationUserRepository.findOne({
      where: {
        reservationId,
        userId: inviterId,
      },
    });

    if (!owner) {
      throw new BadRequestException(
        'У вас нет прав на приглашение пользователя',
      );
    }

    const invite = await this.reservationInviteRepository.create(dto);

    return invite;
  }

  async replyToReservationUserInvite(dto: ReplyReservationInviteDto) {
    const { inviteId, userId, solution } = dto;
    const invite = await this.reservationInviteRepository.findOne({
      where: {
        id: inviteId,
        friendId: userId,
      },
    });
    const reservation = await this.reservationRepository.findByPk(
      invite.reservationId,
    );
    const place = await this.placesService.getPlaceByTableId(
      reservation.tableId,
    );

    await this.reservationInviteRepository.destroy({
      where: {
        id: inviteId,
        friendId: userId,
      },
    });

    if (solution === 'accept') {
      if (invite) {
        const user = await this.reservationUserRepository.create({
          reservationId: invite.reservationId,
          userId: invite.friendId,
          role: 'guest',
        });
        await this.statsService.createPlaceGuest({
          placeId: place.id,
          guestId: userId,
          startDate: reservation.startDate,
          endDate: reservation.endDate,
        });

        return user;
      } else {
        throw new BadRequestException('Приглашение не найдено');
      }
    }

    if (solution === 'reject') {
      return {
        reservationId: invite.reservationId,
        inviterId: invite.inviterId,
      };
    }
  }

  async createReservationUserSeat(dto: CreateTableReservationUserSeatDto) {
    const { seatId, userId, reservationId } = dto;

    const reservationUser = await this.reservationUserRepository.findOne({
      where: { userId, reservationId },
    });
    const seat = await this.seatsService.createReservationUserSeat({
      reservationUserId: reservationUser.id,
      seatId,
    });

    return seat;
  }

  async deleteReservationUserSeat(dto: CreateTableReservationUserSeatDto) {
    const { seatId, userId, reservationId } = dto;

    const reservationUser = await this.reservationUserRepository.findOne({
      where: { userId, reservationId },
    });
    const deleteCount = await this.seatsService.deleteReservationUserSeat({
      reservationUserId: reservationUser.id,
      seatId,
    });

    if (deleteCount > 0) {
      return {
        reservationUserId: reservationUser.id,
        seatId,
        isDeleted: true,
      };
    }

    return false;
  }

  test() {
    return this.changeFreeTables('5d21b6ec0e-d21b6ec0e3-21b6ec0e3e-1b6ec0e3ec');
  }

  private async validateReservationDate(
    tableId: string,
    startDate: Date,
    endDate: Date,
    reservationId?: string,
  ) {
    const nowParseDate = Date.parse(new Date().toISOString());
    const startParseDate = Date.parse(new Date(startDate).toISOString());
    const endParseDate = Date.parse(new Date(endDate).toISOString());
    const datesDifference = endParseDate - startParseDate;
    const minReservationMinutes = 30;
    const maxReservationHours = 24;

    if (
      startParseDate - nowParseDate <= 0 ||
      endParseDate - nowParseDate <= 0
    ) {
      throw new BadRequestException(`Некорректно указано время брони`);
    }

    if (datesDifference < 1000 * 60 * minReservationMinutes) {
      throw new BadRequestException(
        `Минимально время брони ${minReservationMinutes} минут`,
      );
    }

    if (datesDifference > 1000 * 60 * 60 * maxReservationHours) {
      throw new BadRequestException(
        `Максимальное время брони ${maxReservationHours} часа`,
      );
    }

    const { from, till } = getPeriodValues('day', startDate, endDate);

    const whereOptions = reservationId
      ? {
          id: {
            [Op.not]: reservationId,
          },
        }
      : {};

    const reservations = await this.reservationRepository.findAll({
      where: {
        ...whereOptions,

        tableId,
        startDate: {
          [Op.and]: [{ [Op.gte]: from }, { [Op.lte]: till }],
        },
        status: {
          [Op.not]: 'CANCELLED',
        },
      },
    });

    for (let reservstion of reservations) {
      const resStartParseDate = Date.parse(
        new Date(reservstion.startDate).toISOString(),
      );
      const resEndParseDate = Date.parse(
        new Date(reservstion.endDate).toISOString(),
      );
      const startsDifference = startParseDate - resStartParseDate;
      const endsDifference = endParseDate - resEndParseDate;

      if (startsDifference === 0 || endsDifference === 0) {
        throw new BadRequestException(
          `На это время уже назначена бронь c id: ${reservstion.id}`,
        );
      }

      if (startsDifference < 0) {
        if (endParseDate - resStartParseDate > 0) {
          throw new BadRequestException(
            `На это время уже назначена бронь c id: ${reservstion.id}`,
          );
        }
      } else {
        if (resEndParseDate - startParseDate > 0) {
          throw new BadRequestException(
            `На это время уже назначена бронь c id: ${reservstion.id}`,
          );
        }
      }
    }

    return true;
  }

  async changeFreeTables(tableId: string) {
    const place = await this.placesService.getPlaceByTableId(tableId);

    const { from, till } = getPeriodValues('day');
    const reservations = await this.reservationRepository.findAll({
      where: {
        tableId,
        startDate: {
          [Op.and]: [{ [Op.gte]: from }, { [Op.lte]: till }],
        },
        status: {
          [Op.not]: 'CANCELLED',
        },
      },
    });

    // Просматривать все reservations и если все на день занято менять freeTables
    // вызывать эту функцию после создания, изменения и отмены брони (продумать отмену)

    return place.save();
  }
}
