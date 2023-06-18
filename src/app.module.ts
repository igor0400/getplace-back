import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './libs/common';
import { DatabaseModule } from './database/database.module';
import { LoggerModule } from './libs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema,
      envFilePath: `.${process.env.NODE_ENV}.env`,
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
  ],
})
export class AppModule {}
