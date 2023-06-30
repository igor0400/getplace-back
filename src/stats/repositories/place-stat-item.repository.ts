import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PlaceStatItem,
  PlaceStatItemCreationArgs,
} from '../models/place-stat-item.model';

@Injectable()
export class PlaceStatItemRepository extends AbstractRepository<
  PlaceStatItem,
  PlaceStatItemCreationArgs
> {
  protected readonly logger = new Logger(PlaceStatItem.name);

  constructor(
    @InjectModel(PlaceStatItem)
    private placeStatItemModel: typeof PlaceStatItem,
  ) {
    super(placeStatItemModel);
  }
}
