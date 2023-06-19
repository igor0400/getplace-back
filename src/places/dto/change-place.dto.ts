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
import { requestMessages } from 'src/libs/common';
import { days } from '../configs/days';
import { Days } from '../types/days';

export class ChangePlaceDto {
  @ApiProperty({
    example: 'fdfsdfsdf-fdsfsdfsdf-dfsfsdfs3-34r342rsdfs',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;

  @ApiProperty({ example: 'Onyx', description: 'Название', required: false })
  @IsOptional()
  @IsString({ message: requestMessages.isString('title') })
  @MaxLength(100, { message: requestMessages.maxLength('title', 100) })
  readonly title?: string;

  @ApiProperty({
    example: 'Лучшее в мире заведение',
    description: 'Название',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(1000, { message: requestMessages.maxLength('description', 1000) })
  readonly description?: string;

  @ApiProperty({
    example: 'Азиатская кухня',
    description: 'Категория',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('category') })
  @MaxLength(100, { message: requestMessages.maxLength('category', 100) })
  readonly category?: string;

  @ApiProperty({
    example: 2200,
    description: 'Стартовая цена',
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: requestMessages.isNumber('price') })
  readonly price?: number;

  @ApiProperty({
    example: '#000000',
    description: 'Цвет',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('color') })
  readonly color?: string;

  @ApiProperty({
    example: 'Понедельник',
    description: 'День начала работы',
    required: false,
  })
  @IsOptional()
  @IsEnum(days, {
    message: requestMessages.isEnum('workDaysFrom', days),
  })
  readonly workDaysFrom?: Days;

  @ApiProperty({
    example: 'Воскресенье',
    description: 'День окончания работы',
    required: false,
  })
  @IsOptional()
  @IsEnum(days, {
    message: requestMessages.isEnum('workDaysTill', days),
  })
  readonly workDaysTill?: Days;

  @ApiProperty({
    example: '10:00',
    description: 'Время начала работы',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('workTimeFrom') })
  @MaxLength(20, { message: requestMessages.maxLength('workTimeFrom', 20) })
  readonly workTimeFrom?: string;

  @ApiProperty({
    example: '20:00',
    description: 'Время окончания работы',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('workTimeTill') })
  @MaxLength(20, { message: requestMessages.maxLength('workTimeTill', 20) })
  readonly workTimeTill?: string;

  @ApiProperty({
    example: 'Italia, Catanzaro, Contrada Neri 1',
    description: 'Адрес',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('address') })
  @MaxLength(200, { message: requestMessages.maxLength('address', 200) })
  readonly address?: string;

  @ApiProperty({
    example: '+79114063377',
    description: 'Контактный номер телефона',
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber(undefined, { message: requestMessages.isPhone })
  @MaxLength(30, { message: requestMessages.maxLength('contactPhone1', 100) })
  readonly contactPhone1?: string;

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
