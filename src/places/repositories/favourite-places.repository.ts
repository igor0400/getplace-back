import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  FavouritePlaces,
  FavouritePlacesCreationArgs,
} from '../models/favourite-places.model';

@Injectable()
export class FavouritePlacesRepository extends AbstractRepository<
  FavouritePlaces,
  FavouritePlacesCreationArgs
> {
  protected readonly logger = new Logger(FavouritePlaces.name);

  constructor(
    @InjectModel(FavouritePlaces)
    private favouritePlacesModel: typeof FavouritePlaces,
  ) {
    super(favouritePlacesModel);
  }
}
