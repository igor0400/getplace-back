import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { SeatRepository } from './repositories/seat.repository';
import { ChangeSeatDto } from './dto/change-seat.dto';
import { Op } from 'sequelize';

@Injectable()
export class SeatsService {
  constructor(private readonly seatRepository: SeatRepository) {}

  async getAllSeats(limit: number, offset: number, search: string = '') {
    const seats = await this.seatRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      where: {
        number: {
          [Op.like]: `%${search}%`,
        },
      },
      order: ['id'],
    });

    return seats;
  }

  async getSeatById(id: string) {
    const seat = await this.seatRepository.findByPk(id);
    return seat;
  }

  async createSeat(dto: CreateSeatDto) {
    const seat = await this.seatRepository.create(dto);
    return seat;
  }

  async changeSeat(dto: ChangeSeatDto) {
    const seat = await this.getSeatById(dto.seatId);

    if (!seat) {
      throw new NotFoundException('Место не найдено');
    }

    for (let item in dto) {
      if (seat[item]) {
        seat[item] = dto[item];
      }
    }

    return seat.save();
  }

  async deleteSeatById(id: string) {
    const deletedCount = await this.seatRepository.destroy({
      where: {
        id,
      },
    });

    return deletedCount;
  }
}
