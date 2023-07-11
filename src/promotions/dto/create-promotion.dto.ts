import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { requestMessages } from 'src/common';
import { PromotionTypes } from '../types/promotion-types';
import { promotionTypes } from '../configs/promotion-types';
import { PromotionActionTypes } from '../types/promotion-action-types';
import { promotionActionTypes } from '../configs/promotion-action-types';

export class CreatePromotionDto {
  readonly placeId: string;

  @ApiProperty({ example: 'Супер скидки', description: 'Описание' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('description') })
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(500, { message: requestMessages.maxLength('description', 500) })
  readonly description: string;

  @ApiProperty({
    example: 'discount',
    description: 'Тип акции',
    enum: promotionTypes,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('type') })
  @IsEnum(promotionTypes, {
    message: requestMessages.isEnum('type', promotionTypes),
  })
  readonly type: PromotionTypes;

  @ApiProperty({
    example: 'firstVisit',
    description: 'Тип действия акции',
    enum: promotionActionTypes,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('actionType') })
  @IsEnum(promotionActionTypes, {
    message: requestMessages.isEnum('actionType', promotionActionTypes),
  })
  readonly actionType: PromotionActionTypes;

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

  @ApiProperty({
    example: '11:00',
    description: 'Прийти с',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('visitTimeFrom') })
  readonly visitTimeFrom?: string;

  @ApiProperty({
    example: '16:00',
    description: 'Прийти до',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('visitTimeTill') })
  readonly visitTimeTill?: string;
}
