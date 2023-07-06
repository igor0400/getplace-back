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
    example: 4.7,
    description: 'Рейтинг',
    maximum: 5,
    minimum: 1,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('rating') })
  @IsNumber({}, { message: requestMessages.isNumber('rating') })
  @Max(5, { message: requestMessages.max('rating', 5) })
  @Min(1, { message: requestMessages.min('rating', 1) })
  readonly rating: number;

  @ApiProperty({
    example: 'Хорошее заведение',
    description: 'Текст',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('text') })
  @IsString({ message: requestMessages.isNumberString('text') })
  @MaxLength(500, { message: requestMessages.maxLength('text', 500) })
  readonly text: string;
}
