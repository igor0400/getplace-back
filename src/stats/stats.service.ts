import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Op } from 'sequelize';
import { Periods } from './types/periods';
import { EmployeesService } from 'src/employees/employees.service';
import { GetAllItemsGuestsValues } from './types/guests-values';
import { PlaceStatRepository } from './repositories/place-stat.repository';
import { PlaceGuestsRepository } from './repositories/place-guests.repository';
import { Place } from 'src/places/models/place.model';
import { PlaceStatItemRepository } from './repositories/place-stat-item.repository';

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
      const placeGuestsCount = placeGuestsInfo[`${period}Count`];

      places.push({
        placeData: placeStat.placeData,
        guestsCount: placeGuestsCount,
        guestsList: placeGuests,
      });
    }

    return places;
  }

  // async getAllPalcesGuests(dto: GetAllItemsGuestsValues) {
  //   const { employeeId, limit, offset, period } = dto;
  //   const employeePlaces = await this.getEmployeeValidPlaces(employeeId);
  //   const places = [];

  //   for (let place of employeePlaces) {
  //     const placeGuests = await this.getPalceGuests({
  //       itemId: place.id,
  //       limit,
  //       offset,
  //       period,
  //     });
  //     places.push({
  //       placeData: place,
  //       guestsCount: placeGuests.length,
  //       guestsList: placeGuests,
  //     });
  //   }

  //   return places;
  // }

  // async getPalceGuests(dto: GetItemGuestsValues) {
  //   const { itemId } = dto;
  //   const place = await this.placesService.getPlaceById(itemId);
  //   let allGuests = [];

  //   if (!place)
  //     throw new UnauthorizedException(`Заведение с id: ${itemId} не найдено`);

  //   for (let room of place.rooms) {
  //     const roomGuests = await this.getRoomGuests({
  //       ...dto,
  //       itemId: room.id,
  //     });
  //     allGuests = [...allGuests, ...roomGuests];
  //   }

  //   return allGuests;
  // }

  // async getRoomGuests(dto: GetItemGuestsValues) {
  //   const { itemId } = dto;
  //   const room = await this.roomsService.getRoomById(itemId);
  //   let allGuests = [];

  //   if (!room) throw new UnauthorizedException(`Зал с id: ${itemId} не найден`);

  //   for (let table of room.tables) {
  //     const tableGuests = await this.getTablesGuests({
  //       ...dto,
  //       itemId: table.id,
  //     });
  //     allGuests = [...allGuests, ...tableGuests];
  //   }

  //   return allGuests;
  // }

  // async getTablesGuests(dto: GetItemGuestsValues) {
  //   const { period, itemId, limit, offset } = dto;
  //   const { from, till } = this.getPeriodValues(period);
  //   let allGuests = [];

  //   const reservations = await this.tableReservationRepository.findAll({
  //     limit: limit || 20,
  //     offset: offset || 0,
  //     where: {
  //       tableId: itemId,
  //       startDate: {
  //         [Op.and]: [{ [Op.gte]: from }, { [Op.lte]: till }],
  //       },
  //     },
  //     include: [{ model: TableReservationUser, include: [User] }],
  //   });

  //   console.log('RES COUNT: ', reservations.length);

  //   for (let reservation of reservations) {
  //     allGuests = [...allGuests, ...reservation?.users];
  //   }

  //   return allGuests;
  // }

  // async getTablesReservations(dto: GetItemGuestsValues) {
  //   const { period, itemId, limit, offset } = dto;
  //   const { from, till } = this.getPeriodValues(period);

  //   const reservations = await this.tableReservationRepository.findAll({
  //     limit: limit || 20,
  //     offset: offset || 0,
  //     where: {
  //       tableId: itemId,
  //       startDate: {
  //         [Op.and]: [{ [Op.gte]: from }, { [Op.lte]: till }],
  //       },
  //     },
  //   });

  //   return reservations;
  // }

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
