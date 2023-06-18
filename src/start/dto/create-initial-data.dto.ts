import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class CreateInitialDataDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('email') })
  @IsEmail({}, { message: requestMessages.isEmail })
  readonly email: string;

  @ApiProperty({ example: '12345', description: 'Пароль' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('password') })
  @IsString({ message: requestMessages.isString('password') })
  readonly password: string;

  @ApiProperty({ example: '760127649824', description: 'Иин' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('iin') })
  @IsString({ message: requestMessages.isString('iin') })
  readonly iin: string;

  @ApiProperty({ example: '+79114063377', description: 'Номер телефона' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('phone') })
  @IsPhoneNumber(undefined, { message: requestMessages.isPhone })
  readonly phone: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Имя' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('name') })
  @IsString({ message: requestMessages.isString('name') })
  @MaxLength(100, { message: requestMessages.maxLength('name', 100) })
  readonly name: string;

  @ApiProperty({ example: 'some_key', description: 'Секретный ключ' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('secret') })
  @IsString({ message: requestMessages.isString('secret') })
  readonly secret: string;
}
