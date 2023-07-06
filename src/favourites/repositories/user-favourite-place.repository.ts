import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  UserFavouritePlace,
  UserFavouritePlaceCreationArgs,
} from '../models/user-favourite-place.model';

@Injectable()
export class UserFavouritePlaceRepository extends AbstractRepository<
  UserFavouritePlace,
  UserFavouritePlaceCreationArgs
> {
  protected readonly logger = new Logger(UserFavouritePlace.name);

  constructor(
    @InjectModel(UserFavouritePlace)
    private userFavouritePlaceModel: typeof UserFavouritePlace,
  ) {
    super(userFavouritePlaceModel);
  }
}
