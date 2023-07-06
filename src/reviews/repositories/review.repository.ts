import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Review, ReviewCreationArgs } from '../models/review.model';

@Injectable()
export class ReviewRepository extends AbstractRepository<
  Review,
  ReviewCreationArgs
> {
  protected readonly logger = new Logger(Review.name);

  constructor(
    @InjectModel(Review)
    private reviewModel: typeof Review,
  ) {
    super(reviewModel);
  }
}
