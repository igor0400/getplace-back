import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PlaceGuests,
  PlaceGuestsCreationArgs,
} from '../models/place-guests.model';

@Injectable()
export class PlaceGuestsRepository extends AbstractRepository<
  PlaceGuests,
  PlaceGuestsCreationArgs
> {
  protected readonly logger = new Logger(PlaceGuests.name);

  constructor(
    @InjectModel(PlaceGuests)
    private placeGuestsModel: typeof PlaceGuests,
  ) {
    super(placeGuestsModel);
  }
}
