import {
  Injectable,
  BadRequestException,
  forwardRef,
  Inject,
} from '@nestjs/common';
import { TableReservationRepository } from './repositories/reservation.repository';
import { PlacesService } from 'src/places/places.service';
import { Op } from 'sequelize';
import { getPeriodValues } from 'src/common';
import { FreeTableRepository } from 'src/tables/repositories/free-table.repository';
import { Place } from 'src/places/models/place.model';

@Injectable()
export class ValidationsService {
  constructor(
    private readonly reservationRepository: TableReservationRepository,
    private readonly freeTableRepository: FreeTableRepository,
    @Inject(forwardRef(() => PlacesService))
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
        `Минимальное время брони ${minReservationMinutes} минут`,
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

  async changeFreeTablesByPlaceData(place: Place) {
    for (let room of place.rooms) {
      for (let table of room.tables) {
        await this.changeFreeTables(table.id);
      }
    }
  }

  async changeFreeTables(tableId: string) {
    const place = await this.placesService.getPlaceByTableId(tableId);

    const isTableFree = await this.isTableFree(tableId);

    if (isTableFree) {
      const freeTable = await this.freeTableRepository.findOne({
        where: {
          placeId: place.id,
          tableId,
        },
      });

      if (!freeTable) {
        await this.freeTableRepository.create({
          placeId: place.id,
          tableId,
        });
        place.freeTables += 1;
      }
    } else {
      const deleteCount = await this.freeTableRepository.destroy({
        where: {
          placeId: place.id,
          tableId,
        },
      });

      if (deleteCount > 0) {
        place.freeTables -= deleteCount;
      }
    }

    return place.save();
  }

  async isTableFree(tableId: string) {
    const place = await this.placesService.getPlaceByTableId(tableId);

    const from = new Date();
    const till = new Date();

    const placeStartWorkTime = place?.work?.time?.from;
    const placeEndWorkTime = place?.work?.time?.till;
    const startWorkTimeHours = +placeStartWorkTime.split(':')[0];
    const endWorkTimeHours = +placeEndWorkTime.split(':')[0];
    const endWorkTimeMinutes = +placeEndWorkTime.split(':')[1];

    if (endWorkTimeHours <= startWorkTimeHours) {
      till.setUTCHours(24 + endWorkTimeHours, endWorkTimeMinutes, 0, 0);
    } else {
      till.setUTCHours(endWorkTimeHours, endWorkTimeMinutes, 0, 0);
    }

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

    const fromParseDate = Date.parse(from.toISOString());
    const tillParseDate = Date.parse(till.toISOString());

    let totalDatesMilliseconds = 0;
    const maxTotalMilliseconds = tillParseDate - fromParseDate;

    for (let reservation of reservations) {
      const parseReservationStartDate = Date.parse(
        reservation.startDate.toISOString(),
      );
      const parseReservationEndDate = Date.parse(
        reservation.endDate.toISOString(),
      );
      const datesDifference =
        parseReservationEndDate - parseReservationStartDate;

      totalDatesMilliseconds += datesDifference;
    }

    return totalDatesMilliseconds < maxTotalMilliseconds;
  }
}
