import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { requestMessages } from 'src/common';

export class CreateReviewDto {
  @ApiProperty({
    example: 4,
    description: 'Рейтинг кухни',
    maximum: 5,
    minimum: 1,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('ratingKitchen') })
  @IsNumber({}, { message: requestMessages.isNumber('ratingKitchen') })
  @Max(5, { message: requestMessages.max('ratingKitchen', 5) })
  @Min(1, { message: requestMessages.min('ratingKitchen', 1) })
  readonly ratingKitchen: number;

  @ApiProperty({
    example: 4,
    description: 'Рейтинг атмосферы',
    maximum: 5,
    minimum: 1,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('ratingAtmosphere') })
  @IsNumber({}, { message: requestMessages.isNumber('ratingAtmosphere') })
  @Max(5, { message: requestMessages.max('ratingAtmosphere', 5) })
  @Min(1, { message: requestMessages.min('ratingAtmosphere', 1) })
  readonly ratingAtmosphere: number;

  @ApiProperty({
    example: 4,
    description: 'Рейтинг обслуживания',
    maximum: 5,
    minimum: 1,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('ratingService') })
  @IsNumber({}, { message: requestMessages.isNumber('ratingService') })
  @Max(5, { message: requestMessages.max('ratingService', 5) })
  @Min(1, { message: requestMessages.min('ratingService', 1) })
  readonly ratingService: number;

  @ApiProperty({
    example: 'Хорошее заведение',
    description: 'Текст',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('text') })
  @IsString({ message: requestMessages.isNumberString('text') })
  @MaxLength(500, { message: requestMessages.maxLength('text', 500) })
  readonly text: string;
}
