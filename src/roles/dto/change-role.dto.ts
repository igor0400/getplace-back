import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';
import { requestMessages } from 'src/common';

export class ChangeRoleDto {
  readonly roleId: string;

  @ApiProperty({ example: 'USER', description: 'Название', required: false })
  @IsOptional()
  @IsString({ message: requestMessages.isString('value') })
  @MaxLength(50, { message: requestMessages.maxLength('value', 50) })
  readonly value?: string;

  @ApiProperty({
    example: 'Обычный пользователь',
    description: 'Описание',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(300, { message: requestMessages.maxLength('description', 300) })
  readonly description?: string;
}
