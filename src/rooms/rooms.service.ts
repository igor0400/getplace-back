import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { ChangeRoomDto } from './dto/change-room.dto';
import { RoomRepository } from './repositories/room.repository';
import { TablesService } from 'src/tables/tables.service';
import { Op } from 'sequelize';
import { Table } from 'src/tables/models/table.model';
import { Seat } from 'src/seats/models/seat.model';

const roomsInclude = [{ model: Table, include: [Seat] }];

@Injectable()
export class RoomsService {
  constructor(
    private readonly roomRepository: RoomRepository,
    private readonly tablesService: TablesService,
  ) {}

  async getAllRooms(
    limit: number,
    offset: number,
    search: string = '',
    where: any | undefined = {},
  ) {
    const rooms = await this.roomRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
      include: roomsInclude,
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
        ...where,
      },
    });

    return rooms;
  }

  async getRoomById(id: string) {
    const seat = await this.roomRepository.findByPk(id, {
      include: roomsInclude,
    });
    return seat;
  }

  async createRoom(dto: CreateRoomDto) {
    const room = await this.roomRepository.create(dto);
    return room;
  }

  async changeRoom(dto: ChangeRoomDto) {
    const room = await this.getRoomById(dto.roomId);

    if (!room) {
      throw new NotFoundException('Зал не найден');
    }

    for (let item in dto) {
      if (room[item]) {
        room[item] = dto[item];
      }
    }

    return room.save();
  }

  async deleteRoomById(id: string) {
    const room = await this.getRoomById(id);

    if (!room) {
      throw new NotFoundException('Зал не найден');
    }

    const deletedCount = await this.roomRepository.destroy({
      where: {
        id,
      },
    });

    if (room.tables) {
      for (let table of room.tables) {
        await this.tablesService.deleteTableById(table.id);
      }
    }

    return deletedCount;
  }
}
