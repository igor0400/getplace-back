import { AbstractModel } from 'src/common';
import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Table,
} from 'sequelize-typescript';
import { Place } from 'src/places/models/place.model';
import { User } from 'src/users/models/user.model';
import { Review } from './review.model';

export interface PlaceReviewCreationArgs {
  placeId: string;
  userId: string;
  reviewId: string;
}

@Table({ tableName: 'place_reviews', timestamps: false })
export class PlaceReview extends AbstractModel<
  PlaceReview,
  PlaceReviewCreationArgs
> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Review)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reviewId: string;

  @BelongsTo(() => Review)
  reviewData: Review;
}
