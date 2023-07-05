import { Injectable } from '@nestjs/common';
import { Op } from 'sequelize';
import { Periods } from './types/periods';
import { EmployeesService } from 'src/employees/employees.service';
import { GetAllItemsGuestsValues } from './types/guests-values';
import { PlaceStatRepository } from './repositories/place-stat.repository';
import { PlaceGuestsRepository } from './repositories/place-guests.repository';
import { PlaceStatItemRepository } from './repositories/place-stat-item.repository';
import { CreatePlaceGuestDto } from './dto/create-place-guest.dto';
import { ChangePlaceStatItemDto } from './dto/change-place-stat-item.dto';
import { User } from 'src/users/models/user.model';
import { getPeriodValues } from 'src/common';

@Injectable()
export class StatsService {
  constructor(
    private readonly placeStatRepository: PlaceStatRepository,
    private readonly placeGuestsRepository: PlaceGuestsRepository,
    private readonly placeStatItemRepository: PlaceStatItemRepository,
    private readonly employeesService: EmployeesService,
  ) {}

  async getAllPalcesGuests(dto: GetAllItemsGuestsValues) {
    const { employeeId, limit, offset, period = 'day' } = dto;
    const employeePlaces = await this.getEmployeeValidPlaces(employeeId);
    const places = [];

    for (let place of employeePlaces) {
      const { from, till } = getPeriodValues(period);
      const placeStat = await this.placeStatRepository.findOne({
        where: {
          placeId: place.id,
        },
      });

      if (!placeStat) {
        places.push({
          placeData: place,
          guestsCount: 0,
          guestsList: [],
        });
        continue;
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
        include: [User],
      });

      const placeGuestsInfo = await this.placeStatItemRepository.findOne({
        where: {
          placeStatId: placeStat.id,
          title: 'GUESTS_INFO',
        },
      });

      if (!placeGuestsInfo) {
        continue;
      }

      const placeGuestsCount = placeGuestsInfo[`${period}Count`];

      places.push({
        placeData: place,
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

    for (let i = 0; i < deleteCount; i++) {
      await this.changePlaceStatItem({
        placeId,
        title: 'GUESTS_INFO',
        type: 'dec',
      });
    }

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
