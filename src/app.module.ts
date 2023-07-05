import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema, LoggerModule } from './common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EmployeesModule } from './employees/employees.module';
import { RolesModule } from './roles/roles.module';
import { SessionsModule } from './sessions/sessions.module';
import { EmailModule } from './email/email.module';
import { FilesModule } from './files/files.module';
import { PlacesModule } from './places/places.module';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { DishesModule } from './dishes/dishes.module';
import { StartModule } from './start/start.module';
import { StatusesModule } from './statuses/statuses.module';
import { StorageModule } from './storage/storage.module';
import { TablesModule } from './tables/tables.module';
import { RoomsModule } from './rooms/rooms.module';
import { SeatsModule } from './seats/seats.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { AppController } from './app.controller';
import { BoostsModule } from './boosts/boosts.module';
import { StatsModule } from './stats/stats.module';
import { ReservationsModule } from './reservations/reservations.module';
import { PdfModule } from './pdf/pdf.module';
import { BonusesModule } from './bonuses/bonuses.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      envFilePath: `env/.${process.env.NODE_ENV}.env`,
      isGlobal: true,
    }),
    LoggerModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    EmployeesModule,
    RolesModule,
    SessionsModule,
    EmailModule,
    FilesModule,
    PlacesModule,
    RestaurantsModule,
    DishesModule,
    StartModule,
    StatusesModule,
    StorageModule,
    TablesModule,
    RoomsModule,
    SeatsModule,
    OrdersModule,
    PaymentsModule,
    BoostsModule,
    StatsModule,
    ReservationsModule,
    PdfModule,
    BonusesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
