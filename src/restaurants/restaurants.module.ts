import { Module, forwardRef } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { DatabaseModule } from 'src/common';
import { RestaurantRepository } from './repositories/restaurants.repository';
import { Restaurant } from './models/restaurant.model';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';
import { DishesModule } from 'src/dishes/dishes.module';
import { RestaurantDishes } from './models/restaurant-dishes.model';
import { RestaurantDishesRepository } from './repositories/restaurant-dishes.repository';
import { PlacesModule } from 'src/places/places.module';
import { RestaurantMenuService } from './menu/restaurant-menu.service';
import { RestaurantMenuController } from './menu/resturant-menu.controller';

@Module({
  controllers: [RestaurantMenuController, RestaurantsController],
  providers: [
    RestaurantsService,
    RestaurantMenuService,
    RestaurantRepository,
    RestaurantDishesRepository,
  ],
  imports: [
    DatabaseModule.forFeature([Restaurant, RestaurantDishes]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => EmployeesModule),
    forwardRef(() => DishesModule),
    forwardRef(() => PlacesModule),
  ],
  exports: [
    RestaurantsService,
    RestaurantRepository,
    RestaurantDishesRepository,
  ],
})
export class RestaurantsModule {}
