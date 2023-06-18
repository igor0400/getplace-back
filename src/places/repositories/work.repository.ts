import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlaceWork, PlaceWorkCreationArgs } from '../models/work.model';

@Injectable()
export class PlaceWorkRepository extends AbstractRepository<
  PlaceWork,
  PlaceWorkCreationArgs
> {
  protected readonly logger = new Logger(PlaceWork.name);

  constructor(
    @InjectModel(PlaceWork)
    private placeWorkModel: typeof PlaceWork,
  ) {
    super(placeWorkModel);
  }
}
