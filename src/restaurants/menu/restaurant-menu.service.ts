import { Injectable } from '@nestjs/common';
import { Dish } from 'src/dishes/models/dish.model';
import { DishDrink } from 'src/dishes/models/drink.model';
import { DishFood } from 'src/dishes/models/food.model';
import { File } from 'src/files/models/file.model';
import { RestaurantDishesRepository } from '../repositories/restaurant-dishes.repository';

const menuInclude = [{ model: Dish, include: [DishFood, DishDrink, File] }];

@Injectable()
export class RestaurantMenuService {
  constructor(
    private readonly restaurantDishesRepository: RestaurantDishesRepository,
  ) {}

  async getRestaurantMenu(restaurantId: string, limit: number, offset: number) {
    const dishes = await this.restaurantDishesRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
      include: menuInclude,
      where: {
        restaurantId,
      },
    });

    return dishes;
  }
}
