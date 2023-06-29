import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PlaceBoosts,
  PlaceBoostsCreationArgs,
} from '../models/place-boosts.model';

@Injectable()
export class PlaceBoostsRepository extends AbstractRepository<
  PlaceBoosts,
  PlaceBoostsCreationArgs
> {
  protected readonly logger = new Logger(PlaceBoosts.name);

  constructor(
    @InjectModel(PlaceBoosts)
    private placeBoostsModel: typeof PlaceBoosts,
  ) {
    super(placeBoostsModel);
  }
}
