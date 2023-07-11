import { Injectable, BadRequestException } from '@nestjs/common';
import { TableReservationRepository } from './repositories/reservation.repository';
import { TableReservationUserRepository } from './repositories/reservation-user.repository';
import { TableReservationInviteRepository } from './repositories/reservation-invite.repository';
import { TableReservationUser } from './models/table-reservation-user.model';
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
import { ValidationsService } from './validations.service';

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
    private readonly validationsService: ValidationsService,
  ) {}

  async getAllReservations(tableId: string, limit: number, offset: number) {
    const reservations = await this.reservationRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
      include: reservationInclude,
      where: {
        tableId,
      },
      order: ['createdAt'],
    });

    return reservations;
  }

  async getReservationById(id: string, where: any | undefined = {}) {
    const reservation = await this.reservationRepository.findOne({
      include: reservationInclude,
      where: { id, ...where },
    });

    return reservation;
  }

  async createReservation(dto: CreateReservationDto) {
    const { tableId, userId, startDate, endDate } = dto;
    const place = await this.placesService.getPlaceByTableId(tableId);

    await this.validationsService.validateReservationDate(
      tableId,
      startDate,
      endDate,
    );

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
    await this.validationsService.changeFreeTables(tableId);

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
          await this.validationsService.validateReservationDate(
            reservation.tableId,
            dto[item],
            reservation.endDate,
            reservation.id,
          );
          reservation[item] = dto[item];
        } else if (item == 'endDate') {
          await this.validationsService.validateReservationDate(
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
    reservation.save();

    await this.validationsService.changeFreeTables(reservation.tableId);

    return reservation;
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
    reservation.save();

    await this.validationsService.changeFreeTables(reservation.tableId);

    return reservation;
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
}
