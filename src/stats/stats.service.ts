import { Injectable, NotFoundException } from '@nestjs/common';
import { Op } from 'sequelize';
import { Periods } from './types/periods';
import { EmployeesService } from 'src/employees/employees.service';
import { GetAllItemsGuestsValues } from './types/guests-values';
import { PlaceStatRepository } from './repositories/place-stat.repository';
import { PlaceGuestsRepository } from './repositories/place-guests.repository';
import { Place } from 'src/places/models/place.model';
import { PlaceStatItemRepository } from './repositories/place-stat-item.repository';
import { CreatePlaceGuestDto } from './dto/create-place-guest.dto';
import { ChangePlaceStatItemDto } from './dto/change-place-stat-item.dto';
import { DeletePlaceGuestDto } from './dto/delete-place-guest.dto';

@Injectable()
export class StatsService {
  constructor(
    private readonly placeStatRepository: PlaceStatRepository,
    private readonly placeGuestsRepository: PlaceGuestsRepository,
    private readonly placeStatItemRepository: PlaceStatItemRepository,
    private readonly employeesService: EmployeesService,
  ) {}

  async getAllPalcesGuests(dto: GetAllItemsGuestsValues) {
    const { employeeId, limit, offset, period } = dto;
    const employeePlaces = await this.getEmployeeValidPlaces(employeeId);
    const places = [];

    for (let place of employeePlaces) {
      const { from, till } = this.getPeriodValues(period);
      const placeStat = await this.placeStatRepository.findOne({
        where: {
          placeId: place.id,
        },
        include: [Place],
      });

      if (!placeStat) {
        throw new NotFoundException('Модель статистики заведения не найдена');
      }

      const placeGuests = await this.placeGuestsRepository.findAll({
        limit: limit || 20,
        offset: offset || 0,
        where: {
          placeId: place.id,
          startDate: {
            [Op.and]: [{ [Op.gte]: from }, { [Op.lte]: till }],
          },
        },
      });

      const placeGuestsInfo = await this.placeStatItemRepository.findOne({
        where: {
          placeStatId: placeStat.id,
          title: 'GUESTS_INFO',
        },
      });

      if (!placeGuestsInfo) {
        throw new NotFoundException(
          'Модель статистики гостей заведения не найдена',
        );
      }

      const placeGuestsCount = placeGuestsInfo[`${period}Count`];

      places.push({
        placeData: placeStat.placeData,
        guestsCount: placeGuestsCount,
        guestsList: placeGuests,
      });
    }

    return places;
  }

  async createPlaceGuest(dto: CreatePlaceGuestDto) {
    const { placeId } = dto;
    const placeStat = await this.placeStatRepository.findOrCreate({
      where: {
        placeId,
      },
    });
    const placeGuest = await this.placeGuestsRepository.create({
      ...dto,
      placeStatId: placeStat.id,
    });

    await this.changePlaceStatItem({
      placeId,
      title: 'GUESTS_INFO',
      type: 'inc',
    });

    return placeGuest;
  }

  async deletePlaceGuest(dto: CreatePlaceGuestDto) {
    const { placeId } = dto;
    const deleteCount = await this.placeGuestsRepository.destroy({
      where: { ...dto },
    });

    await this.changePlaceStatItem({
      placeId,
      title: 'GUESTS_INFO',
      type: 'dec',
    });

    return deleteCount;
  }

  async changePlaceStatItem(dto: ChangePlaceStatItemDto) {
    const { title, placeId, type } = dto;
    const placeStat = await this.placeStatRepository.findOrCreate({
      where: {
        placeId,
      },
    });
    const placeStatItem = await this.placeStatItemRepository.findOrCreate({
      where: {
        placeStatId: placeStat.id,
        title,
      },
    });

    const {
      daysLastClearDate,
      weeksLastClearDate,
      monthsLastClearDate,
      yearsLastClearDate,
    } = placeStatItem;
    const daysDifference = this.getTimeDifference(daysLastClearDate);
    const weeksDifference = this.getTimeDifference(weeksLastClearDate);

    function changeCount(item: any) {
      if (type === 'inc') {
        placeStatItem[item] += 1;
      } else {
        if (placeStatItem[item] > 0) placeStatItem[item] -= 1;
      }
    }

    function resetCount(item: any) {
      if (type === 'inc') {
        placeStatItem[item] = 1;
      } else {
        placeStatItem[item] = 0;
      }
    }

    changeCount('allTimeCount');

    if (daysDifference < 1000 * 60 * 60 * 24) {
      changeCount('dayCount');
    } else {
      resetCount('dayCount');
      placeStatItem.daysLastClearDate = new Date();
    }

    if (weeksDifference < 1000 * 60 * 60 * 24 * 7) {
      changeCount('weekCount');
    } else {
      resetCount('weekCount');
      placeStatItem.weeksLastClearDate = new Date();
    }

    if (
      new Date().getUTCMonth() === new Date(monthsLastClearDate).getUTCMonth()
    ) {
      changeCount('monthCount');
    } else {
      resetCount('monthCount');
      placeStatItem.monthsLastClearDate = new Date();
    }

    if (
      new Date().getUTCFullYear() ===
      new Date(yearsLastClearDate).getUTCFullYear()
    ) {
      changeCount('yearCount');
    } else {
      resetCount('yearCount');
      placeStatItem.yearsLastClearDate = new Date();
    }

    return placeStatItem.save();
  }

  private getTimeDifference(date: Date) {
    return (
      Date.parse(new Date().toISOString()) -
      Date.parse(new Date(date).toISOString())
    );
  }

  private getPeriodValues(period: Periods) {
    const from = new Date();
    const till = new Date();

    switch (period) {
      case 'day':
        from.setUTCHours(0, 0, 0, 0);
        till.setUTCHours(23, 59, 59, 999);
        break;
      case 'week':
        const curr = new Date();
        const first = curr.getUTCDate() - curr.getUTCDay() + 1;
        const last = first + 6;

        from.setUTCDate(first);
        till.setUTCDate(last);
        from.setUTCHours(0, 0, 0, 0);
        till.setUTCHours(23, 59, 59, 999);
        break;
      case 'month':
        from.setUTCDate(1);
        till.setUTCMonth(till.getUTCMonth() + 1, 1);
        from.setUTCHours(0, 0, 0, 0);
        till.setUTCHours(0, 0, 0, 0);
        break;
      case 'year':
        from.setUTCHours(0, 0, 0, 0);
        till.setUTCHours(0, 0, 0, 0);
        from.setUTCMonth(0, 1);
        till.setUTCMonth(0, 1);
        till.setUTCFullYear(till.getUTCFullYear() + 1);
        break;
      case 'allTime':
        from.setTime(0);
        till.setUTCFullYear(till.getUTCFullYear() + 1000);
        break;
    }

    return {
      from,
      till,
    };
  }

  private async getEmployeeValidPlaces(employeeId: string) {
    const employee = await this.employeesService.getEmployeeById(employeeId);
    const validRoles = ['OWNER', 'ANALYTICS'];
    const places = [];

    for (let place of employee.places) {
      for (let role of place.employeeRoles) {
        if (validRoles.includes(role.value)) {
          places.push(place.placeData);
        }
      }
    }

    return places;
  }
}
