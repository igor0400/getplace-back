import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class CreateReservationUserSeatDto {
  readonly reservationUserId: string;

  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id места',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('seatId') })
  @IsString({ message: requestMessages.isString('seatId') })
  readonly seatId: string;
}
