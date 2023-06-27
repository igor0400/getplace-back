import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { requestMessages } from 'src/common';

export class CreateRoleDto {
  @ApiProperty({ example: 'USER', description: 'Название' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('value') })
  @IsString({ message: requestMessages.isString('value') })
  @MaxLength(50, { message: requestMessages.maxLength('value', 50) })
  readonly value: string;

  @ApiProperty({ example: 'Обычный пользователь', description: 'Описание' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('description') })
  @IsString({ message: requestMessages.isString('description') })
  @MaxLength(300, { message: requestMessages.maxLength('description', 300) })
  readonly description: string;
}
