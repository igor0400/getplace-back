import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';
import { requestMessages } from 'src/common';

export class ChangeDishDto {
  readonly dishId: string;

  @ApiProperty({
    example: 'Бургер',
    description: 'Название',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('title') })
  @MaxLength(50, { message: requestMessages.maxLength('title', 50) })
  readonly title?: string;

  @ApiProperty({
    example: 'Очень вкусный',
    description: 'Описание',
    maxLength: 300,
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(300, { message: requestMessages.maxLength('description', 300) })
  readonly description?: string;

  @ApiProperty({
    example: 'Фастфуд',
    description: 'Категория',
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('catigory') })
  @MaxLength(50, { message: requestMessages.maxLength('catigory', 50) })
  readonly catigory?: string;

  @ApiProperty({
    example: '1200',
    description: 'Стартовая цена',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('cost') })
  readonly cost?: string;

  @ApiProperty({
    example: '1',
    description: 'Позиция в меню',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('position') })
  readonly position?: string;

  @ApiProperty({
    example: true,
    description: 'Доступно',
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean({ message: requestMessages.isBoolean('isAvailable') })
  readonly isAvailable?: boolean;

  @ApiProperty({
    example: '800',
    description: 'Вес в граммах',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('weight') })
  readonly weight?: string;

  @ApiProperty({
    example: '800',
    description: 'Размер в сантиметрах',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('size') })
  readonly size?: string;

  @ApiProperty({
    example: '1',
    description: 'Объём в литрах',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('volume') })
  readonly volume?: string;
}
