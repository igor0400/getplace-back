import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Op } from 'sequelize';
import { TableReservationRepository } from 'src/tables/repositories/reservation.repository';
import { Periods } from './types/periods';
import { PlacesService } from 'src/places/places.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { TablesService } from 'src/tables/tables.service';
import { EmployeesService } from 'src/employees/employees.service';
import { TableReservationUser } from 'src/tables/models/reservation-user.model';
import { User } from 'src/users/models/user.model';

@Injectable()
export class StatsService {
  constructor(
    private readonly tableReservationRepository: TableReservationRepository,
    private readonly placesService: PlacesService,
    private readonly roomsService: RoomsService,
    private readonly tablesService: TablesService,
    private readonly employeesService: EmployeesService,
  ) {}

  async getAllPalcesGuests(period: Periods = 'day', employeeId: string) {
    const employeePlaces = await this.getEmployeeValidPlaces(employeeId);
    const places = [];

    for (let place of employeePlaces) {
      const placeGuests = await this.getPalceGuests(period, place.id);
      places.push({
        placeData: place,
        guestsCount: placeGuests.length,
        guestsList: placeGuests,
      });
    }

    return places;
  }

  async getPalceGuests(period: Periods, placeId: string) {
    const place = await this.placesService.getPlaceById(placeId);
    let allGuests = [];

    if (!place)
      throw new UnauthorizedException(`Заведение с id: ${placeId} не найдено`);

    for (let room of place.rooms) {
      const roomGuests = await this.getRoomGuests(period, room.id);
      allGuests = [...allGuests, ...roomGuests];
    }

    return allGuests;
  }

  async getRoomGuests(period: Periods, roomId: string) {
    const room = await this.roomsService.getRoomById(roomId);
    let allGuests = [];

    if (!room) throw new UnauthorizedException(`Зал с id: ${roomId} не найден`);

    for (let table of room.tables) {
      const tableGuests = await this.getTablesGuests(period, table.id);
      allGuests = [...allGuests, ...tableGuests];
    }

    return allGuests;
  }

  async getTablesGuests(period: Periods, tableId: string) {
    const { from, till } = this.getPeriodValues(period);
    let allGuests = [];

    const reservations = await this.tableReservationRepository.findAll({
      where: {
        tableId,
        startDate: {
          [Op.and]: [{ [Op.gte]: from }, { [Op.lte]: till }],
        },
      },
      include: [{ model: TableReservationUser, include: [User] }],
    });

    for (let reservation of reservations) {
      allGuests = [...allGuests, ...reservation?.users];
    }

    return allGuests;
  }

  async getTablesReservations(period: Periods, tableId: string) {
    const { from, till } = this.getPeriodValues(period);

    const reservations = await this.tableReservationRepository.findAll({
      where: {
        tableId,
        startDate: {
          [Op.and]: [{ [Op.gte]: from }, { [Op.lte]: till }],
        },
      },
    });

    return reservations;
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
