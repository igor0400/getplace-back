import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class DeleteReservationOrderDishDto {
  readonly userId: string;

  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id блюда заказа',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('reservationOrderDishId') })
  @IsString({ message: requestMessages.isString('reservationOrderDishId') })
  readonly reservationOrderDishId: string;
}
