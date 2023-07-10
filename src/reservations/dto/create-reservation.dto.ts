import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class CreateReservationDto {
  readonly userId: string;

  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id стола',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('tableId') })
  @IsString({ message: requestMessages.isString('tableId') })
  readonly tableId: string;

  @ApiProperty({
    example: '2023-08-24T10:00:00.319Z',
    description: 'Дата начала',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('startDate') })
  @IsDate({ message: requestMessages.isDate('startDate') })
  readonly startDate: Date;

  @ApiProperty({
    example: '2023-08-24T11:00:00.319Z',
    description: 'Дата окончания',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('endDate') })
  @IsDate({ message: requestMessages.isDate('endDate') })
  readonly endDate: Date;
}
