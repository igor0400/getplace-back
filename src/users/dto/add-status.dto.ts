import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class AddStatusDto {
  @ApiProperty({ example: 'PREMIUM', description: 'Название статуса' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('value') })
  @IsString({ message: requestMessages.isString('value') })
  readonly value: string;

  @ApiProperty({
    example: 'fgdsuyf-$0cjcsdonovsiov',
    description: 'id пользователя',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('userId') })
  @IsString({ message: requestMessages.isString('userId') })
  readonly userId: string;
}