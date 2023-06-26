import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class ChangeReservationOrderDishDto {
  readonly userId: string;

  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id блюда заказа',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('reservationOrderDishId') })
  @IsString({ message: requestMessages.isString('reservationOrderDishId') })
  readonly reservationOrderDishId: string;

  @ApiProperty({
    example: 2,
    description: 'Колличество',
    required: false,
    default: 1,
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('count') })
  readonly count?: number;
}
