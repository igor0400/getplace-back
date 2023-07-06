import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { DatabaseModule } from 'src/common';
import { Review } from './models/review.model';
import { PlaceReview } from './models/place-review.model';
import { ReviewRepository } from './repositories/review.repository';
import { PlaceReviewRepository } from './repositories/place-review.repository';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [DatabaseModule.forFeature([Review, PlaceReview]), PaymentsModule],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewRepository, PlaceReviewRepository],
  exports: [ReviewsService],
})
export class ReviewsModule {}
