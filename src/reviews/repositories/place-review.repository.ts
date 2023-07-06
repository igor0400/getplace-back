import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PlaceReview,
  PlaceReviewCreationArgs,
} from '../models/place-review.model';

@Injectable()
export class PlaceReviewRepository extends AbstractRepository<
  PlaceReview,
  PlaceReviewCreationArgs
> {
  protected readonly logger = new Logger(PlaceReview.name);

  constructor(
    @InjectModel(PlaceReview)
    private placeReviewModel: typeof PlaceReview,
  ) {
    super(placeReviewModel);
  }
}
