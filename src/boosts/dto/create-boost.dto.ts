import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { requestMessages } from 'src/common';

export class CreateBoostDto {
  @ApiProperty({
    example: 'YELLOW_FRAME',
    description: 'Название',
    maxLength: 50,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('value') })
  @IsString({ message: requestMessages.isString('value') })
  @MaxLength(50, { message: requestMessages.maxLength('value', 50) })
  readonly value: string;

  @ApiProperty({
    example: 'Рамка желтого цвета',
    description: 'Описание',
    maxLength: 300,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('description') })
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(300, { message: requestMessages.maxLength('description', 300) })
  readonly description: string;

  @ApiProperty({
    example: '1000',
    description: 'Цена',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('price') })
  @IsString({ message: requestMessages.isString('price') })
  @MaxLength(100, { message: requestMessages.maxLength('price', 100) })
  readonly price: string;

  @ApiProperty({
    example: 'KZT',
    description: 'Валюта',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('currency') })
  @IsString({ message: requestMessages.isString('currency') })
  @MaxLength(50, { message: requestMessages.maxLength('currency', 50) })
  readonly currency: string;
}
