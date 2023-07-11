import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { requestMessages } from 'src/common';

export class ChangePromotionDto {
  @ApiProperty({ example: 'Супер скидки', description: 'Описание' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('description') })
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(500, { message: requestMessages.maxLength('description', 500) })
  readonly description?: string;

  @ApiProperty({
    example: 10,
    description: 'Скидка в процентах',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: requestMessages.isNumber('discountAmount') })
  readonly discountAmount?: number;

  @ApiProperty({
    example: 1000,
    description: 'Сумма заказа от',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: requestMessages.isNumber('buyFromAmount') })
  readonly buyFromAmount?: number;

  @ApiProperty({
    example: 'KZT',
    description: 'Валюта заказа от',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('buyFromCurrency') })
  readonly buyFromCurrency?: string;

  @ApiProperty({
    example: 'idfosfbhsdbfis-fdnsbfskdfd-fdsfsdfsdfsdf-dfsfsdfdsfdsf',
    description: 'id блюда',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('dishId') })
  readonly dishId?: string;
}
