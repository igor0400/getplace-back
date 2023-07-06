import { CreateReviewDto } from './create-review.dto';

export class CreatePlaceReviewDto extends CreateReviewDto {
  readonly placeId: string;
  readonly userId: string;
}
