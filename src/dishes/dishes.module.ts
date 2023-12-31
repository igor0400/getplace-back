import { Module } from '@nestjs/common';
import { DishesService } from './dishes.service';
import { DatabaseModule } from 'src/common';
import { Dish } from './models/dish.model';
import { DishDrink } from './models/drink.model';
import { DishFood } from './models/food.model';
import { DishImages } from './models/images.model';
import { DishRepository } from './repositories/dish.repository';
import { DishImagesRepository } from './repositories/images.repository';
import { DishDrinkRepository } from './repositories/drink.repository';
import { DishFoodRepository } from './repositories/food.repository';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Dish, DishDrink, DishFood, DishImages]),
    FilesModule,
  ],
  providers: [
    DishesService,
    DishRepository,
    DishImagesRepository,
    DishDrinkRepository,
    DishFoodRepository,
  ],
  exports: [
    DishesService,
    DishRepository,
    DishImagesRepository,
    DishDrinkRepository,
    DishFoodRepository,
  ],
})
export class DishesModule {}
