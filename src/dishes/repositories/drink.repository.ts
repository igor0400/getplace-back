import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DishDrink, DishDrinkCreationArgs } from '../models/drink.model';

@Injectable()
export class DishDrinkRepository extends AbstractRepository<
  DishDrink,
  DishDrinkCreationArgs
> {
  protected readonly logger = new Logger(DishDrink.name);

  constructor(
    @InjectModel(DishDrink)
    private dishDrinkModel: typeof DishDrink,
  ) {
    super(dishDrinkModel);
  }
}
