import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class CreateReservationOrderDishDto {
  readonly userId: string;

  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id бронирования',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('reservationId') })
  @IsString({ message: requestMessages.isString('reservationId') })
  readonly reservationId: string;

  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id блюда',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('dishId') })
  @IsString({ message: requestMessages.isString('dishId') })
  readonly dishId: string;

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
