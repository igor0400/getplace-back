import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsEmail,
  IsString,
  IsPhoneNumber,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { requestMessages } from 'src/common';

export class UsersLoginRequest {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('email') })
  @IsEmail({}, { message: requestMessages.isEmail })
  readonly email: string;

  @ApiProperty({ example: '12345', description: 'Пароль' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('password') })
  @IsString({ message: requestMessages.isString('password') })
  readonly password: string;
}

export class UsersRegisterRequest {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('email') })
  @IsEmail({}, { message: requestMessages.isEmail })
  @MaxLength(100, { message: requestMessages.maxLength('email', 100) })
  readonly email: string;

  @ApiProperty({ example: '37HDd903u6', description: 'Код подтверждения' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('verifyCode') })
  @IsString({ message: requestMessages.isString('verifyCode') })
  readonly verifyCode: string;

  @ApiProperty({ example: '12345', description: 'Пароль' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('password') })
  @IsString({ message: requestMessages.isString('password') })
  @MaxLength(500, { message: requestMessages.maxLength('password', 500) })
  readonly password: string;

  @ApiProperty({ example: '760127649824', description: 'Иин' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('iin') })
  @IsString({ message: requestMessages.isString('iin') })
  @MaxLength(100, { message: requestMessages.maxLength('iin', 100) })
  readonly iin: string;

  @ApiProperty({ example: '+79114063377', description: 'Номер телефона' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('phone') })
  @IsPhoneNumber(undefined, { message: requestMessages.isPhone })
  @MaxLength(100, { message: requestMessages.maxLength('phone', 100) })
  readonly phone: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('name') })
  @IsString({ message: requestMessages.isString('name') })
  @MaxLength(100, { message: requestMessages.maxLength('name', 100) })
  readonly name: string;

  @ApiProperty({
    example: '1Kb719528bee',
    description: 'Реферальный код пользователя',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('referalCode') })
  readonly referalCode?: string;
}
