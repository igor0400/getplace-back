import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { tableStates } from '../configs/table-states';
import { requestMessages } from 'src/common';
import { TableStates } from '../types/table-states';

export class ChangeTableStatusDto {
  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id стола',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('tableId') })
  @IsString({ message: requestMessages.isString('tableId') })
  readonly tableId: string;

  @ApiProperty({
    example: 'selected',
    description: 'Состояние стола',
    enum: tableStates,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('state') })
  @IsEnum(tableStates, {
    message: requestMessages.isEnum('state', tableStates),
  })
  readonly state: TableStates;
}
