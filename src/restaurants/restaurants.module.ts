import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { DatabaseModule } from 'src/libs/common';
import { RestaurantRepository } from './repositories/restaurants.repository';
import { Restaurant } from './models/restaurant.model';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantRepository],
  imports: [
    DatabaseModule.forFeature([Restaurant]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    EmployeesModule,
  ],
  exports: [RestaurantsService, RestaurantRepository],
})
export class RestaurantsModule {}
