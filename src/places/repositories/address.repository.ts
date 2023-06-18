import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PlaceAddress,
  PlaceAddressCreationArgs,
} from '../models/address.model';

@Injectable()
export class PlaceAddressRepository extends AbstractRepository<
  PlaceAddress,
  PlaceAddressCreationArgs
> {
  protected readonly logger = new Logger(PlaceAddress.name);

  constructor(
    @InjectModel(PlaceAddress)
    private placeAddressModel: typeof PlaceAddress,
  ) {
    super(placeAddressModel);
  }
}
