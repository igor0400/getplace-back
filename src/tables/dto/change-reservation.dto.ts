import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

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
    example: '2023-08-24T10:00:00.319Z',
    description: 'Дата начала',
  })
  @IsOptional()
  @IsDate({ message: requestMessages.isDate('startDate') })
  readonly startDate?: string;

  @ApiProperty({
    example: '2023-08-24T11:00:00.319Z',
    description: 'Дата окончания',
  })
  @IsOptional()
  @IsDate({ message: requestMessages.isDate('startDate') })
  readonly endDate?: string;
}
