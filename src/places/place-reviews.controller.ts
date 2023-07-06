import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Get,
  Query,
  Param,
  Req,
  Patch,
  Inject,
  forwardRef,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiDefaultResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ReviewsService } from 'src/reviews/reviews.service';
import { CreatePlaceReviewDto } from 'src/reviews/dto/create-place-review.dto';
import { CustomReq } from 'src/common';
import { ChangePlaceReviewDto } from 'src/reviews/dto/change-place-review.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Заведения')
@Controller('places/:placeId/reviews')
export class PlaceReviewsController {
  constructor(
    @Inject(forwardRef(() => ReviewsService))
    private readonly reviewsService: ReviewsService,
  ) {}

  @ApiDefaultResponse({ description: 'Получение всех отзывов заведения' })
  @ApiQuery({
    name: 'limit',
    description: 'Ограничение колличества',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Отступ от начала',
    required: false,
  })
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @Get()
  getAllPlaceReviews(
    @Param('placeId') placeId: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return this.reviewsService.getAllPlaceReviews(placeId, +limit, +offset);
  }

  @ApiDefaultResponse({
    description: 'Создание отзыва заведения (только с Bearer токеном)',
  })
  @ApiBody({
    type: CreatePlaceReviewDto,
  })
  @ApiBearerAuth('Bearer token only')
  @UseGuards(JwtAuthGuard)
  @Post()
  createPlaceReview(
    @Body() dto: CreatePlaceReviewDto,
    @Req() req: CustomReq,
    @Param('placeId') placeId: string,
  ) {
    return this.reviewsService.createPlaceReview({
      ...dto,
      userId: req.user.sub,
      placeId,
    });
  }

  @ApiDefaultResponse({
    description: 'Изменение отзыва заведения (только с Bearer токеном)',
  })
  @ApiBody({
    type: ChangePlaceReviewDto,
  })
  @ApiBearerAuth('Bearer token only')
  @UseGuards(JwtAuthGuard)
  @Patch(':reviewId')
  changePlaceReview(
    @Param('reviewId') reviewId: string,
    @Req() req: CustomReq,
    @Body() dto: ChangePlaceReviewDto,
  ) {
    return this.reviewsService.changePlaceReview({
      ...dto,
      reviewId,
      userId: req.user.sub,
    });
  }

  @ApiDefaultResponse({
    description: 'Удаление отзыва заведения (только с Bearer токеном)',
  })
  @ApiBearerAuth('Bearer token only')
  @UseGuards(JwtAuthGuard)
  @Delete(':reviewId')
  deletePlaceReviewById(
    @Param('reviewId') reviewId: string,
    @Req() req: CustomReq,
  ) {
    return this.reviewsService.deletePlaceReviewById(reviewId, req.user.sub);
  }
}
