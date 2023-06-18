import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  RestaurantDishes,
  RestaurantDishesCreationArgs,
} from '../models/restaurant-dishes.model';

@Injectable()
export class RestaurantDishesRepository extends AbstractRepository<
  RestaurantDishes,
  RestaurantDishesCreationArgs
> {
  protected readonly logger = new Logger(RestaurantDishes.name);

  constructor(
    @InjectModel(RestaurantDishes)
    private restaurantDishesModel: typeof RestaurantDishes,
  ) {
    super(restaurantDishesModel);
  }
}
