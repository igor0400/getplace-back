import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { requestMessages } from 'src/common';

export class ChangeEmployeeDto {
  readonly employeeId: string;

  @ApiProperty({ example: '37HDd903u6', description: 'Код подтверждения' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('verifyCode') })
  @IsString({ message: requestMessages.isString('verifyCode') })
  readonly verifyCode: string;

  @ApiProperty({ example: '760127649824', description: 'Иин', required: false })
  @IsOptional()
  @IsString({ message: requestMessages.isString('iin') })
  readonly iin?: string;

  @ApiProperty({
    example: '+79114063377',
    description: 'Номер телефона',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('phone') })
  readonly phone?: string;

  @ApiProperty({
    example: 'user@mail.ru',
    description: 'Почта',
    required: false,
  })
  @IsOptional()
  @IsEmail({}, { message: requestMessages.isEmail })
  @MaxLength(100, { message: requestMessages.maxLength('email', 100) })
  readonly email?: string;

  @ApiProperty({
    example: 'Иван Иванов',
    description: 'Имя',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('name') })
  @MaxLength(100, { message: requestMessages.maxLength('name', 100) })
  readonly name?: string;

  @ApiProperty({
    example: '08.12.1989',
    description: 'Дата рождения',
    required: false,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('birthday') })
  @MaxLength(30, { message: requestMessages.maxLength('birthday', 30) })
  readonly birthday?: string;
}
