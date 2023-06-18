import { ApiProperty } from '@nestjs/swagger';
import { DishTypes } from '../types/dish-types';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { requestMessages } from 'src/libs/common';
import { dishTypes } from '../configs/dish-types';

export class CreateDishDto {
  @ApiProperty({ example: 'Бургер', description: 'Название', maxLength: 50 })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('title') })
  @IsString({ message: requestMessages.isString('title') })
  @MaxLength(50, { message: requestMessages.maxLength('title', 50) })
  readonly title: string;

  @ApiProperty({
    example: 'Очень вкусный',
    description: 'Описание',
    maxLength: 300,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('description') })
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(300, { message: requestMessages.maxLength('description', 300) })
  readonly description: string;

  @ApiProperty({
    example: 'Фастфуд',
    description: 'Категория',
    maxLength: 50,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('catigory') })
  @IsString({ message: requestMessages.isString('catigory') })
  @MaxLength(50, { message: requestMessages.maxLength('catigory', 50) })
  readonly catigory: string;

  @ApiProperty({
    example: 'food',
    description: 'Тип',
    enum: dishTypes,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('type') })
  @IsEnum(dishTypes, {
    message: requestMessages.isEnum('type', dishTypes.join(', ')),
  })
  readonly type: DishTypes;

  @ApiProperty({
    example: 1200,
    description: 'Стартовая цена',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('cost') })
  @IsNumber({}, { message: requestMessages.isNumber('cost') })
  readonly cost: number;

  @ApiProperty({
    example: 1200,
    description: 'Стартовая цена',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('position') })
  @IsNumber({}, { message: requestMessages.isNumber('position') })
  readonly position: number;

  @ApiProperty({
    example: true,
    description: 'Доступно',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: requestMessages.isBoolean('isAvailable') })
  readonly isAvailable: boolean;
}
