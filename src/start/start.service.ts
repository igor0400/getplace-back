import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { Response, Request } from 'express';
import { EmployeesAuthService } from '../auth/employees-auth.service';
import { RolesService } from '../roles/roles.service';
import { EmployeesService } from '../employees/employees.service';
import { roles } from './configs/roles';
import { statuses } from './configs/statuses';
import { StatusesService } from 'src/statuses/statuses.service';
import { UsersService } from 'src/users/users.service';
import { UsersAuthService } from 'src/auth/users-auth.service';
import { CreateTestDataDto } from './dto/create-test-data.dto';
import { PlacesService } from 'src/places/places.service';
import { RoomsService } from 'src/rooms/rooms.service';
import { TablesService } from 'src/tables/tables.service';
import { SeatsService } from 'src/seats/seats.service';
import { ReservationsService } from 'src/reservations/reservations.service';
import testDtos from './configs/test-dtos';
import { TableReservationUserRepository } from 'src/reservations/repositories/reservation-user.repository';
import { RestaurantsService } from 'src/restaurants/restaurants.service';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class StartService {
  constructor(
    private readonly employeesAuthService: EmployeesAuthService,
    private readonly usersAuthService: UsersAuthService,
    private readonly rolesService: RolesService,
    private readonly employeesService: EmployeesService,
    private readonly usersService: UsersService,
    private readonly statusesService: StatusesService,
    private readonly placesService: PlacesService,
    private readonly roomsService: RoomsService,
    private readonly tablesService: TablesService,
    private readonly seatsService: SeatsService,
    private readonly reservationsService: ReservationsService,
    private readonly reservationUserRepository: TableReservationUserRepository,
    private readonly restaurantsService: RestaurantsService,
    private readonly ordersService: OrdersService,
  ) {}

  async createInitialData(
    dto: CreateInitialDataDto,
    response: Response,
    request: Request,
  ) {
    // создание ролей
    const createdRoles = [];

    for (let role of roles) {
      const createdRole = await this.rolesService.findOrCreateRole(role);

      if (!createdRole) {
        throw new UnauthorizedException(`Ошибка создания роли ${role.value}`);
      }

      createdRoles.push(createdRole);
    }

    // создание статусов
    const createdStatuses = [];

    for (let status of statuses) {
      const createdStatus = await this.statusesService.findOrCreateStatus(
        status,
      );

      if (!createdStatus) {
        throw new UnauthorizedException(
          `Ошибка создания статуса пользователя: ${status.value}`,
        );
      }

      createdStatuses.push(createdStatus);
    }

    // создние супер сотрудника
    const employeeData = await this.employeesAuthService.createRegiserData(
      {
        ...dto,
        verifyCode: '000000',
      },
      response,
      request,
    );

    if (!employeeData) {
      throw new UnauthorizedException('Ошибка создания сотрудника');
    }

    await this.employeesService.addRole({
      employeeId: employeeData.employee.id,
      value: 'ADMIN',
    });

    // создние супер пользователя
    const userData = await this.usersAuthService.createRegiserData(
      {
        ...dto,
        verifyCode: '000000',
      },
      response,
      request,
    );

    if (!userData) {
      throw new UnauthorizedException('Ошибка создания пользователя');
    }

    await this.usersService.addRole({
      userId: userData.user.id,
      value: 'ADMIN',
    });

    return {
      employeeData,
      userData,
      roles: createdRoles,
      statuses: createdStatuses,
    };
  }

  async createTestData(
    dto: CreateTestDataDto,
    images?: {
      placeImage?: Express.Multer.File[];
      dishImage?: Express.Multer.File[];
    },
  ) {
    const { email } = dto;
    const employee = await this.employeesService.getEmployeeByEmail(email);
    const user = await this.usersService.getUserByEmail(email);

    if (!employee || !user) {
      throw new BadRequestException(
        'Пользователь или сотрудник с таким email не найдены',
      );
    }

    const place = await this.placesService.createPlace(
      testDtos.place(employee.id),
      images?.placeImage,
    );
    const room = await this.roomsService.createRoom(testDtos.room(place.id));
    const table = await this.tablesService.createTable(
      testDtos.table(place.id, room.id),
    );
    const seat = await this.seatsService.createSeat(
      testDtos.seat(place.id, table.id),
    );
    const reservation = await this.reservationsService.createReservation(
      testDtos.reservation(user.id, table.id),
    );

    const reservationsStartDate = new Date();
    const reservationsEndDate = new Date();
    reservationsStartDate.setUTCHours(19, 0, 0, 0);
    reservationsEndDate.setUTCHours(20, 0, 0, 0);

    await this.reservationsService.createReservation(
      testDtos.reservation(
        user.id,
        table.id,
        reservationsStartDate,
        reservationsEndDate,
      ),
    );

    reservationsStartDate.setUTCHours(20, 0, 0, 0);
    reservationsEndDate.setUTCHours(21, 0, 0, 0);
    await this.reservationsService.createReservation(
      testDtos.reservation(
        user.id,
        table.id,
        reservationsStartDate,
        reservationsEndDate,
      ),
    );

    reservationsStartDate.setUTCHours(21, 0, 0, 0);
    reservationsEndDate.setUTCHours(22, 0, 0, 0);
    await this.reservationsService.createReservation(
      testDtos.reservation(
        user.id,
        table.id,
        reservationsStartDate,
        reservationsEndDate,
      ),
    );

    const reservationUser = await this.reservationUserRepository.findOne({
      where: {
        reservationId: reservation.id,
        userId: user.id,
      },
    });
    await this.reservationsService.createReservationUserSeat(
      testDtos.reservationUserSeat(
        user.id,
        reservation.id,
        reservationUser.id,
        seat.id,
      ),
    );

    const placeDish = await this.restaurantsService.createDish(
      testDtos.placeDish(place.id),
      images?.dishImage,
    );

    const reservationOrder = await this.ordersService.createReservationOrder({
      reservationId: reservation.id,
    });
    await this.ordersService.createReservationOrderDish({
      userId: user.id,
      reservationId: reservation.id,
      dishId: placeDish.dishInfo.id,
    });
    await this.ordersService.payReservationOrder({
      userId: user.id,
      reservationOrderId: reservationOrder.id,
    });

    return this.placesService.getPlaceById(place.id);
  }
}
