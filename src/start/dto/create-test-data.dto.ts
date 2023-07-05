import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class CreateTestDataDto {
  @ApiProperty({ example: 'some_key', description: 'Секретный ключ' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('secret') })
  @IsString({ message: requestMessages.isString('secret') })
  readonly secret: string;

  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('email') })
  @IsEmail({}, { message: requestMessages.isEmail })
  readonly email: string;
}
