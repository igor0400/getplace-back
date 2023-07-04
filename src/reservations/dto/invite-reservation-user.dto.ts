import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class InviteReservationUserDto {
  readonly inviterId: string;

  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id друга',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('friendId') })
  @IsString({ message: requestMessages.isString('friendId') })
  readonly friendId: string;

  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id брони',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('reservationId') })
  @IsString({ message: requestMessages.isString('reservationId') })
  readonly reservationId: string;
}
