import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ReviewRepository } from './repositories/review.repository';
import { PlaceReviewRepository } from './repositories/place-review.repository';
import { CreatePlaceReviewDto } from './dto/create-place-review.dto';
import { ChangePlaceReviewDto } from './dto/change-place-review.dto';
import { Review } from './models/review.model';
import { ReservationOrderPaymentUserRepository } from 'src/payments/repositories/reservation-order-payment-user.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly placeReviewRepository: PlaceReviewRepository,
    private readonly reservationOrderPaymentUserRepository: ReservationOrderPaymentUserRepository,
  ) {}

  async getAllPlaceReviews(placeId: string, limit: number, offset: number) {
    const reviews = await this.placeReviewRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
      include: [Review],
      where: {
        placeId,
      },
    });

    return reviews;
  }

  async createPlaceReview(dto: CreatePlaceReviewDto) {
    const { placeId, userId, text } = dto;

    const ratingKitchen = Math.round(dto.ratingKitchen),
      ratingAtmosphere = Math.round(dto.ratingAtmosphere),
      ratingService = Math.round(dto.ratingService);

    const payment = await this.reservationOrderPaymentUserRepository.findOne({
      where: {
        userId,
        placeId,
      },
    });

    if (!payment) {
      throw new UnauthorizedException(
        'Для того чтобы оставить отзыв, необходимо сделать заказ в заведении',
      );
    }

    const totalRating = Math.round(
      (ratingKitchen + ratingAtmosphere + ratingService) / 3,
    );

    const review = await this.reviewRepository.create({
      totalRating,
      ratingKitchen,
      ratingAtmosphere,
      ratingService,
      text,
    });
    await this.placeReviewRepository.create({
      placeId,
      userId,
      reviewId: review.id,
    });

    return review;
  }

  async changePlaceReview(dto: ChangePlaceReviewDto) {
    const { reviewId, userId } = dto;

    const placeReview = await this.placeReviewRepository.findOne({
      where: {
        reviewId,
        userId,
      },
    });

    if (!placeReview) {
      throw new BadRequestException(
        'Отзыв не найден или у вас не прав на его изменение',
      );
    }

    const review = await this.reviewRepository.findByPk(reviewId);

    for (let item in dto) {
      if (review[item]) {
        if (
          item === 'ratingKitchen' ||
          item === 'ratingAtmosphere' ||
          item === 'ratingService'
        ) {
          review[item] = Math.round(dto[item]);
        } else {
          review[item] = dto[item];
        }
      }
    }

    review.save();

    const totalRating = Math.round(
      (review.ratingKitchen + review.ratingAtmosphere + review.ratingService) /
        3,
    );

    review.totalRating = totalRating;

    return review.save();
  }

  async deletePlaceReviewById(reviewId: string, userId: string) {
    const placeDeleteCount = await this.placeReviewRepository.destroy({
      where: {
        reviewId,
        userId,
      },
    });

    if (placeDeleteCount) {
      await this.reviewRepository.destroy({
        where: {
          id: reviewId,
        },
      });
    }

    return placeDeleteCount;
  }
}

// Сделать отзывы у заведений, но только после покупки
