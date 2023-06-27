import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DishFood, DishFoodCreationArgs } from '../models/food.model';

@Injectable()
export class DishFoodRepository extends AbstractRepository<
  DishFood,
  DishFoodCreationArgs
> {
  protected readonly logger = new Logger(DishFood.name);

  constructor(
    @InjectModel(DishFood)
    private dishFoodModel: typeof DishFood,
  ) {
    super(dishFoodModel);
  }
}
