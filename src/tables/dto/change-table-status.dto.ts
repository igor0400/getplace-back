import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { tableStates } from '../configs/table-states';
import { requestMessages } from 'src/libs/common';
import { TableStates } from '../types/table-states';

export class ChangeTableStatusDto {
  readonly tableId: string;

  @ApiProperty({
    example: 'free',
    description: 'Состояние стола',
    default: 'free',
    required: false,
    enum: tableStates,
  })
  @IsOptional()
  @IsEnum(tableStates, {
    message: requestMessages.isEnum('state', tableStates),
  })
  readonly state?: TableStates;
}
