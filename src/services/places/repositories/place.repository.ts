import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Place, PlaceCreationArgs } from '../models/place.model';

@Injectable()
export class PlaceRepository extends AbstractRepository<
  Place,
  PlaceCreationArgs
> {
  protected readonly logger = new Logger(Place.name);

  constructor(
    @InjectModel(Place)
    private placeModel: typeof Place,
  ) {
    super(placeModel);
  }
}
