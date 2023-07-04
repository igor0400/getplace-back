import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { TableRepository } from './repositories/table.repository';
import { SeatsService } from 'src/seats/seats.service';
import { Seat } from 'src/seats/models/seat.model';
import { ChangeTableDto } from './dto/change-table.dto';
import { Op } from 'sequelize';
import { TableReservation } from 'src/reservations/model/table-reservation.model';

const tablesInclude = [Seat, TableReservation];

@Injectable()
export class TablesService {
  constructor(
    private readonly tableRepository: TableRepository,
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
    const table = await this.tableRepository.findByPk(id, {
      include: tablesInclude,
    });

    return table;
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
}
