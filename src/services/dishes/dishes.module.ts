import { Module } from '@nestjs/common';
import { DishesController } from './dishes.controller';
import { DishesService } from './dishes.service';
import { DatabaseModule } from 'src/libs/common';
import {
  DishDrinkRepository,
  DishFoodRepository,
  DishImagesRepository,
  DishRepository,
  RestaurantDishesRepository,
} from './repositories';
import { Dish } from './models/dish.model';
import { DishDrink } from './models/drink.model';
import { DishFood } from './models/food.model';
import { DishImages } from './models/images.model';
import { RestaurantDishes } from './models/restaurant-dishes.model';

@Module({
  imports: [
    DatabaseModule.forFeature([
      Dish,
      DishDrink,
      DishFood,
      DishImages,
      RestaurantDishes,
    ]),
  ],
  controllers: [DishesController],
  providers: [
    DishesService,
    DishRepository,
    DishImagesRepository,
    DishDrinkRepository,
    DishFoodRepository,
    RestaurantDishesRepository,
  ],
  exports: [
    DishesService,
    DishRepository,
    DishImagesRepository,
    DishDrinkRepository,
    DishFoodRepository,
    RestaurantDishesRepository,
  ],
})
export class DishesModule {}
