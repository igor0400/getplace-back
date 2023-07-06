import { Injectable, BadRequestException } from '@nestjs/common';
import { TableReservationRepository } from './repositories/reservation.repository';
import { PlacesService } from 'src/places/places.service';
import { Op } from 'sequelize';
import { getPeriodValues } from 'src/common';
import { FreeTableRepository } from 'src/tables/repositories/free-table.repository';

@Injectable()
export class ValidationsService {
  constructor(
    private readonly reservationRepository: TableReservationRepository,
    private readonly freeTableRepository: FreeTableRepository,
    private readonly placesService: PlacesService,
  ) {}

  async validateReservationDate(
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

    // вызывать эту функцию после создания, изменения и отмены брони (продумать отмену)

    // если стол свободен искать его в freeTables, если его там нет добавить и place.freeTables, если он там есть ничего не делать
    // если стол занят искать его в freeTables, если его там есть удалить и убавить place.freeTables, если его там нет ничего не делать

    // await this.freeTableRepository.create({
    //   placeId: dto.placeId,
    //   tableId: table.id,
    // });

    return place.save();
  }

  private async isTableFree(tableId: string) {
    // Просматривать все reservations и если все на день занято возвращать false
  }
}
