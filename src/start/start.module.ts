import { Module } from '@nestjs/common';
import { StartService } from './start.service';
import { StartController } from './start.controller';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { StatusesModule } from 'src/statuses/statuses.module';
import { PlacesModule } from 'src/places/places.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { SeatsModule } from 'src/seats/seats.module';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { TablesModule } from 'src/tables/tables.module';
import { OrdersModule } from 'src/orders/orders.module';
import { RestaurantsModule } from 'src/restaurants/restaurants.module';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
  controllers: [StartController],
  providers: [StartService],
  imports: [
    AuthModule,
    RolesModule,
    EmployeesModule,
    UsersModule,
    StatusesModule,
    PlacesModule,
    RoomsModule,
    TablesModule,
    SeatsModule,
    ReservationsModule,
    RestaurantsModule,
    OrdersModule,
    ReviewsModule,
  ],
})
export class StartModule {}
