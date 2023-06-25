import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { requestMessages } from 'src/libs/common';
import { ReservationStatuses } from '../types/reservation-statuses';
import { reservationStatuses } from '../configs/reservation-statuses';

export class ChangeReservationDto {
  readonly userId: string;

  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id брони',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('reservationId') })
  @IsString({ message: requestMessages.isString('reservationId') })
  readonly reservationId: string;

  @ApiProperty({
    example: 'CONFIRMED',
    description: 'Статус брони',
    enum: reservationStatuses,
  })
  @IsOptional()
  @IsEnum(reservationStatuses, {
    message: requestMessages.isEnum('status', reservationStatuses),
  })
  readonly status?: ReservationStatuses;

  @ApiProperty({
    example: '2023-08-24T10:00:00.319Z',
    description: 'Дата начала',
  })
  @IsOptional()
  @IsDate({ message: requestMessages.isDate('startDate') })
  readonly startDate?: Date;

  @ApiProperty({
    example: '2023-08-24T11:00:00.319Z',
    description: 'Дата окончания',
  })
  @IsOptional()
  @IsDate({ message: requestMessages.isDate('startDate') })
  readonly endDate?: Date;
}