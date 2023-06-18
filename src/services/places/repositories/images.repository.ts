import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PlaceImages, PlaceImagesCreationArgs } from '../models/images.model';

@Injectable()
export class PlaceImagesRepository extends AbstractRepository<
  PlaceImages,
  PlaceImagesCreationArgs
> {
  protected readonly logger = new Logger(PlaceImages.name);

  constructor(
    @InjectModel(PlaceImages)
    private placeImagesModel: typeof PlaceImages,
  ) {
    super(placeImagesModel);
  }
}
