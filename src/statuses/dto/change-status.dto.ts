import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { requestMessages } from 'src/common';

export class ChangeStatusDto {
  readonly statusId: string;

  @ApiProperty({
    example: 'PREMIUM',
    description: 'Название',
    required: false,
    maxLength: 50,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('value') })
  @MaxLength(50, { message: requestMessages.maxLength('value', 50) })
  readonly value?: string;

  @ApiProperty({
    example: 'Стандартный пакет премиум',
    description: 'Описание',
    required: false,
    maxLength: 300,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(300, { message: requestMessages.maxLength('description', 300) })
  readonly description?: string;
}
