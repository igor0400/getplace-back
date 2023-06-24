import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class TableReservationDto {
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
    description: 'Дата',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('date') })
  @IsString({ message: requestMessages.isString('date') })
  readonly date: string;
}
