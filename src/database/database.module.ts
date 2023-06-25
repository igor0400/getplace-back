import { Module } from '@nestjs/common';
import { DatabaseModule as AppDatabaseModule } from 'src/libs/common';
import { Dish } from '../dishes/models/dish.model';
import { DishDrink } from '../dishes/models/drink.model';
import { DishFood } from '../dishes/models/food.model';
import { DishImages } from '../dishes/models/images.model';
import { RestaurantDishes } from '../restaurants/models/restaurant-dishes.model';
import { Employee } from '../employees/models/employee.model';
import { File } from '../files/models/file.model';
import { Place } from '../places/models/place.model';
import { PlaceAddress } from '../places/models/address.model';
import { PlaceEmployees } from '../places/models/employees.model';
import { FavouritePlaces } from '../places/models/favourite-places.model';
import { PlaceImages } from '../places/models/images.model';
import { WorkDays } from '../places/models/work-days.model';
import { WorkTime } from '../places/models/work-time.model';
import { PlaceWork } from '../places/models/work.model';
import { ReferalInvitedUsers } from '../referals/models/invited-users.model';
import { ReferalInviters } from '../referals/models/inviters.model';
import { Referals } from '../referals/models/referal.model';
import { Restaurant } from '../restaurants/models/restaurant.model';
import { EmployeePlaceRoles } from '../roles/models/employee-place-roles.model';
import { EmployeeRoles } from '../roles/models/employee-roles.model';
import { Role } from '../roles/models/roles.model';
import { UserRoles } from '../roles/models/user-roles.model';
import { EmployeeSession } from '../sessions/models/employee-session.model';
import { UserSession } from '../sessions/models/user-session.model';
import { User } from '../users/models/user.model';
import { Status } from 'src/statuses/models/status.model';
import { UserStatuses } from 'src/statuses/models/user-statuses';
import { Room } from 'src/rooms/models/room.model';
import { Table } from 'src/tables/models/table.model';
import { Seat } from 'src/seats/models/seat.model';
import { TableReservation } from 'src/tables/models/reservation.model';
import { TableReservationUser } from 'src/tables/models/reservation-user.model';
import { SeatReservation } from 'src/seats/models/reservation.model';
import { SeatReservationUser } from 'src/seats/models/reservation-user.model';
import { TableReservationInvite } from 'src/tables/models/reservation-invite.model';

@Module({
  imports: [
    AppDatabaseModule.forRoot([
      Dish,
      DishDrink,
      DishFood,
      DishImages,
      RestaurantDishes,
      Employee,
      File,
      Place,
      PlaceAddress,
      PlaceEmployees,
      FavouritePlaces,
      PlaceImages,
      WorkDays,
      WorkTime,
      PlaceWork,
      ReferalInvitedUsers,
      ReferalInviters,
      Referals,
      Restaurant,
      EmployeePlaceRoles,
      EmployeeRoles,
      Role,
      UserRoles,
      EmployeeSession,
      UserSession,
      User,
      Status,
      UserStatuses,
      Room,
      Table,
      TableReservation,
      TableReservationUser,
      TableReservationInvite,
      Seat,
      SeatReservation,
      SeatReservationUser,
    ]),
  ],
})
export class DatabaseModule {}
