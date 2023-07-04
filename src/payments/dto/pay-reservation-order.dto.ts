import { ApiProperty } from '@nestjs/swagger';
import { ReservationOrderPaymentTypes } from '../types/reservation-order-payment-types';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { requestMessages } from 'src/common';
import { reservationOrderPaymentTypes } from '../configs/reservation-order-payment-types';

export class PayReservationOrderDto {
  readonly userId: string;

  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id заказа бронирования',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('reservationOrderId') })
  @IsString({ message: requestMessages.isString('reservationOrderId') })
  readonly reservationOrderId: string;

  @ApiProperty({
    example: 'eachForHimself',
    description: 'тип оплаты',
    enum: reservationOrderPaymentTypes,
    required: false,
    default: 'oneForAll',
  })
  @IsOptional()
  @IsEnum(reservationOrderPaymentTypes, {
    message: requestMessages.isEnum('type', reservationOrderPaymentTypes),
  })
  readonly type?: ReservationOrderPaymentTypes;
}
