import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Restaurant, RestaurantCreationArgs } from '../models/restaurant.model';

@Injectable()
export class RestaurantRepository extends AbstractRepository<
  Restaurant,
  RestaurantCreationArgs
> {
  protected readonly logger = new Logger(Restaurant.name);

  constructor(
    @InjectModel(Restaurant)
    private restaurantModel: typeof Restaurant,
  ) {
    super(restaurantModel);
  }
}
