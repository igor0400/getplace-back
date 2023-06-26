import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';
import { CreateReservationUserSeatDto } from 'src/seats/dto/create-reservation-user-seat.dto';

export class CreateTableReservationUserSeatDto extends CreateReservationUserSeatDto {
  readonly userId: string;

  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id бронирования',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('reservationId') })
  @IsString({ message: requestMessages.isString('reservationId') })
  readonly reservationId: string;
}
