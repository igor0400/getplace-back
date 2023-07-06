import { ChangeReviewDto } from './change-review.dto';

export class ChangePlaceReviewDto extends ChangeReviewDto {
  readonly reviewId: string;
  readonly userId: string;
}
