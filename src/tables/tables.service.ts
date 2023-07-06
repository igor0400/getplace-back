import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { TableRepository } from './repositories/table.repository';
import { SeatsService } from 'src/seats/seats.service';
import { Seat } from 'src/seats/models/seat.model';
import { ChangeTableDto } from './dto/change-table.dto';
import { Op } from 'sequelize';
import { TableReservation } from 'src/reservations/model/table-reservation.model';
import { PlacesService } from 'src/places/places.service';
import { FreeTableRepository } from './repositories/free-table.repository';

const tablesInclude = [Seat, TableReservation];

@Injectable()
export class TablesService {
  constructor(
    private readonly tableRepository: TableRepository,
    private readonly freeTableRepository: FreeTableRepository,
    private readonly seatsService: SeatsService,
    @Inject(forwardRef(() => PlacesService))
    private readonly placesService: PlacesService,
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
    const isTableCreated = await this.tableRepository.findOne({
      where: {
        roomId: dto.roomId,
        positionX: dto.positionX,
        positionY: dto.positionY,
      },
    });

    if (isTableCreated) {
      throw new BadRequestException(
        'Стол с таким же расположением уже существует',
      );
    }

    const table = await this.tableRepository.create(dto);

    const place = await this.placesService.getPlaceById(dto.placeId);
    place.freeTables += 1;
    place.save();

    await this.freeTableRepository.create({
      placeId: dto.placeId,
      tableId: table.id,
    });

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
