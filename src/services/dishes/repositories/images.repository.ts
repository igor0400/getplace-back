import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { DishImages, DishImagesCreationArgs } from '../models/images.model';

@Injectable()
export class DishImagesRepository extends AbstractRepository<
  DishImages,
  DishImagesCreationArgs
> {
  protected readonly logger = new Logger(DishImages.name);

  constructor(
    @InjectModel(DishImages)
    private dishImagesModel: typeof DishImages,
  ) {
    super(dishImagesModel);
  }
}
