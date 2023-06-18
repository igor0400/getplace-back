import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class ChangePasswordDto {
  readonly employeeId: string;

  @ApiProperty({ example: '37HDd903u6', description: 'Код подтверждения' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('verifyCode') })
  @IsString({ message: requestMessages.isString('verifyCode') })
  readonly verifyCode: string;

  @ApiProperty({ example: '12345', description: 'Старый пароль' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('oldPassword') })
  @IsString({ message: requestMessages.isString('oldPassword') })
  readonly oldPassword: string;

  @ApiProperty({ example: '54321', description: 'Новый пароль' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('newPassword') })
  @IsString({ message: requestMessages.isString('newPassword') })
  readonly newPassword: string;
}
