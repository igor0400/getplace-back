import { Injectable } from '@nestjs/common';
import { DishRepository } from './repositories/dish.repository';
import { CreateDishDto } from './dto/create-dish.dto';
import { DishFoodRepository } from './repositories/food.repository';
import { DishDrinkRepository } from './repositories/drink.repository';
import { ChangeDishDto } from './dto/change-dish.dto';
import { DishDrink } from './models/drink.model';
import { DishFood } from './models/food.model';

const dishInclude = [DishDrink, DishFood];

@Injectable()
export class DishesService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly dishFoodRepository: DishFoodRepository,
    private readonly dishDrinkRepository: DishDrinkRepository,
  ) {}

  async getDishById(id: string) {
    const dish = await this.dishRepository.findByPk(id, {
      include: dishInclude,
    });

    return dish;
  }

  async createDish(dto: CreateDishDto) {
    const {
      title,
      description,
      catigory,
      type,
      cost,
      position,
      weight,
      size,
      volume,
    } = dto;

    const dish = await this.dishRepository.create({
      title,
      description,
      catigory,
      type,
      cost,
      position,
    });

    if (volume) {
      await this.dishDrinkRepository.create({
        dishId: dish.id,
        volume,
      });
    }

    if (weight || size) {
      await this.dishFoodRepository.create({
        dishId: dish.id,
        weight,
        size,
      });
    }

    return this.getDishById(dish.id);
  }

  async changeDish(dto: ChangeDishDto) {
    const { dishId, weight, size, volume } = dto;

    const dish = await this.getDishById(dishId);

    for (let item in dto) {
      if (dish[item]) {
        dish[item] = dto[item];
      }
    }

    dish.save();

    if (weight || size) {
      const food = await await this.dishFoodRepository.findOne({
        where: {
          dishId,
        },
      });
      if (food) {
        if (weight) food.weight = weight;
        if (size) food.size = size;
        food.save();
      } else {
        await this.dishFoodRepository.create({
          dishId,
          weight,
          size,
        });
      }
    }

    if (volume) {
      const drink = await await this.dishDrinkRepository.findOne({
        where: {
          dishId,
        },
      });

      if (drink) {
        if (volume) drink.volume = volume;
        drink.save();
      } else {
        await this.dishDrinkRepository.create({
          dishId,
          volume,
        });
      }
    }
  }

  async deleteDishById(id: string) {
    const deleteCount = await this.dishRepository.destroy({
      where: {
        id,
      },
    });
    await this.dishDrinkRepository.destroy({
      where: {
        dishId: id,
      },
    });
    await this.dishFoodRepository.destroy({
      where: {
        dishId: id,
      },
    });

    return deleteCount;
  }
}
