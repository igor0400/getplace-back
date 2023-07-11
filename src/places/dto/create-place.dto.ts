import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { requestMessages } from 'src/common';
import { PlaceTypes } from '../types/place-types';
import { placeTypes } from '../configs/place-types';
import { Days } from '../types/days';
import { days } from '../configs/days';

export class CreatePlaceDto {
  readonly employeeId: string;

  @ApiProperty({ example: 'Onyx', description: 'Название' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('title') })
  @IsString({ message: requestMessages.isString('title') })
  @MaxLength(100, { message: requestMessages.maxLength('title', 100) })
  readonly title: string;

  @ApiProperty({ example: 'Лучшее в мире заведение', description: 'Описание' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('description') })
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(1000, { message: requestMessages.maxLength('description', 1000) })
  readonly description: string;

  @ApiProperty({
    example: 'restaurant',
    description: 'Тип заведения',
    enum: placeTypes,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('type') })
  @IsEnum(placeTypes, {
    message: requestMessages.isEnum('type', placeTypes),
  })
  readonly type: PlaceTypes;

  @ApiProperty({ example: 'Азиатская кухня', description: 'Категория' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('category') })
  @IsString({ message: requestMessages.isString('category') })
  @MaxLength(100, { message: requestMessages.maxLength('category', 100) })
  readonly category: string;

  @ApiProperty({
    example: '2200',
    description: 'Стартовая цена',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('price') })
  readonly price?: string;

  @ApiProperty({
    example: '#000000',
    description: 'Цвет',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('color') })
  @IsString({ message: requestMessages.isString('color') })
  readonly color: string;

  @ApiProperty({ example: 'Понедельник', description: 'День начала работы' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('workDaysFrom') })
  @IsEnum(days, {
    message: requestMessages.isEnum('workDaysFrom', days),
  })
  readonly workDaysFrom: Days;

  @ApiProperty({ example: 'Воскресенье', description: 'День окончания работы' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('workDaysTill') })
  @IsEnum(days, {
    message: requestMessages.isEnum('workDaysTill', days),
  })
  readonly workDaysTill: Days;

  @ApiProperty({ example: '10:00', description: 'Время начала работы' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('workTimeFrom') })
  @IsString({ message: requestMessages.isString('workTimeFrom') })
  @MaxLength(20, { message: requestMessages.maxLength('workTimeFrom', 20) })
  readonly workTimeFrom: string;

  @ApiProperty({ example: '20:00', description: 'Время окончания работы' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('workTimeTill') })
  @IsString({ message: requestMessages.isString('workTimeTill') })
  @MaxLength(20, { message: requestMessages.maxLength('workTimeTill', 20) })
  readonly workTimeTill: string;

  @ApiProperty({
    example: 'Italia, Catanzaro, Contrada Neri 1',
    description: 'Адрес',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('address') })
  @IsString({ message: requestMessages.isString('address') })
  @MaxLength(200, { message: requestMessages.maxLength('address', 200) })
  readonly address: string;

  @ApiProperty({
    example: '+79114063377',
    description: 'Контактный номер телефона',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('contactPhone1') })
  @IsPhoneNumber(undefined, { message: requestMessages.isPhone })
  @MaxLength(30, { message: requestMessages.maxLength('contactPhone1', 100) })
  readonly contactPhone1: string;

  @ApiProperty({
    example: '+79114063377',
    description: 'Контактный номер телефона',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: requestMessages.isPhone })
  @MaxLength(30, { message: requestMessages.maxLength('contactPhone2', 100) })
  readonly contactPhone2?: string;

  @ApiProperty({
    example: '+79114063377',
    description: 'Контактный номер телефона',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: requestMessages.isPhone })
  @MaxLength(30, { message: requestMessages.maxLength('contactPhone3', 100) })
  readonly contactPhone3?: string;
}
