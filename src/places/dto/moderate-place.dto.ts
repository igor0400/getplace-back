import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class ModeratePlaceDto {
  readonly placeId: string;

  @ApiProperty({ example: 'accept', description: 'Решение' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('solution') })
  @IsEnum(['accept', 'reject'], {
    message: requestMessages.isEnum('solution', ['accept', 'reject']),
  })
  readonly solution: 'accept' | 'reject';
}
