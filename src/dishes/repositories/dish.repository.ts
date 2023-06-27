import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Dish, DishCreationArgs } from '../models/dish.model';

@Injectable()
export class DishRepository extends AbstractRepository<Dish, DishCreationArgs> {
  protected readonly logger = new Logger(Dish.name);

  constructor(
    @InjectModel(Dish)
    private dishModel: typeof Dish,
  ) {
    super(dishModel);
  }
}
