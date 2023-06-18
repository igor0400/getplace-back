import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './configs';
import { DatabaseModule } from './services/database/database.module';
import { LoggerModule } from './libs/common';
import { AuthModule } from './services/auth/auth.module';
import { UsersModule } from './services/users/users.module';
import { EmployeesModule } from './services/employees/employees.module';
import { RolesModule } from './services/roles/roles.module';
import { SessionsModule } from './services/sessions/sessions.module';
import { EmailModule } from './services/email/email.module';
import { FilesModule } from './services/files/files.module';
import { PlacesModule } from './services/places/places.module';
import { RestaurantsModule } from './services/restaurants/restaurants.module';
import { DishesModule } from './services/dishes/dishes.module';
import { StartModule } from './services/start/start.module';

// перенести все из service в src
// удалить все index файлы
// может перенести все в другую папку
// и на крайняк сделать lib без index

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
