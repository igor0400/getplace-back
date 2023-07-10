import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';
import { requestMessages } from 'src/common';

export class ChangePasswordDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('email') })
  @IsEmail({}, { message: requestMessages.isEmail })
  @MaxLength(100, { message: requestMessages.maxLength('email', 100) })
  readonly email: string;
}
