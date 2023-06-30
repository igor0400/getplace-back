import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlaceStat, PlaceStatCreationArgs } from '../models/place-stat.model';

@Injectable()
export class PlaceStatRepository extends AbstractRepository<
  PlaceStat,
  PlaceStatCreationArgs
> {
  protected readonly logger = new Logger(PlaceStat.name);

  constructor(
    @InjectModel(PlaceStat)
    private placeStatModel: typeof PlaceStat,
  ) {
    super(placeStatModel);
  }
}
