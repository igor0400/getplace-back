import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { TableRepository } from './repositories/table.repository';
import { SeatsService } from 'src/seats/seats.service';
import { Seat } from 'src/seats/models/seat.model';
import { ChangeTableDto } from './dto/change-table.dto';
import { Op } from 'sequelize';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { TableReservationRepository } from './repositories/reservation.repository';
import { TableReservationUserRepository } from './repositories/reservation-user.repository';
import { TableReservationUser } from './models/reservation-user.model';
import { User } from 'src/users/models/user.model';
import { ChangeReservationDto } from './dto/change-reservation.dto';
import { InviteReservationUserDto } from './dto/invite-reservation-user.dto';
import { TableReservationInviteRepository } from './repositories/reservation-invite.repository';
import { ReplyReservationInviteDto } from './dto/reply-reservation-invite.dto';

const tablesInclude = [Seat];
const reservationInclude = [{ model: TableReservationUser, include: [User] }];

@Injectable()
export class TablesService {
  constructor(
    private readonly tableRepository: TableRepository,
    private readonly reservationRepository: TableReservationRepository,
    private readonly reservationUserRepository: TableReservationUserRepository,
    private readonly reservationInviteRepository: TableReservationInviteRepository,
    private readonly seatsService: SeatsService,
  ) {}

  async getAllTables(limit: number, offset: number, search: string = '') {
    const tables = await this.tableRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      include: tablesInclude,
      where: {
        number: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    return tables;
  }

  async getTableById(id: string) {
    const seat = await this.tableRepository.findByPk(id, {
      include: tablesInclude,
    });
    return seat;
  }

  async createTable(dto: CreateTableDto) {
    const table = await this.tableRepository.create(dto);
    return table;
  }

  async changeTable(dto: ChangeTableDto) {
    const table = await this.getTableById(dto.tableId);

    if (!table) {
      throw new NotFoundException('Стол не найден');
    }

    for (let item in dto) {
      if (table[item]) {
        table[item] = dto[item];
      }
    }

    return table.save();
  }

  async deleteTableById(id: string) {
    const table = await this.getTableById(id);

    if (!table) {
      throw new NotFoundException('Стол не найден');
    }

    const deletedCount = await this.tableRepository.destroy({
      where: {
        id,
      },
    });

    if (table.seats) {
      for (let seat of table.seats) {
        await this.seatsService.deleteSeatById(seat.id);
      }
    }

    return deletedCount;
  }

  async getReservationById(id: string) {
    const reservation = await this.reservationRepository.findByPk(id, {
      include: reservationInclude,
    });

    return reservation;
  }

  async createReservation(dto: CreateReservationDto) {
    const reservation = await this.reservationRepository.create(dto);
    await this.reservationUserRepository.create({
      reservationId: reservation.id,
      userId: dto.userId,
      role: 'owner',
    });

    return this.getReservationById(reservation.id);
  }

  async changeReservation(dto: ChangeReservationDto) {
    const { reservationId, userId } = dto;
    const reservation = await this.reservationRepository.findByPk(
      reservationId,
      { include: reservationInclude },
    );
    const user = await this.reservationUserRepository.findOne({
      where: {
        reservationId,
        userId,
      },
    });

    if (!user) {
      throw new BadRequestException('У вас нет доступа к этой брони');
    }

    for (let item in dto) {
      if (reservation[item]) {
        reservation[item] = dto[item];
      }
    }

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

  
}
