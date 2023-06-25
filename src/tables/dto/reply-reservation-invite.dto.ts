import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class ReplyReservationInviteDto {
  readonly userId: string;

  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id приглашения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('inviteId') })
  @IsString({ message: requestMessages.isString('inviteId') })
  readonly inviteId: string;

  @ApiProperty({ example: 'accept', description: 'Решение' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('solution') })
  @IsEnum(['accept', 'reject'], {
    message: requestMessages.isEnum('solution', ['accept', 'reject']),
  })
  readonly solution: 'accept' | 'reject';
}
