import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { tableStates } from '../configs/table-states';
import { requestMessages } from 'src/libs/common';
import { TableStates } from '../types/table-states';

export class ChangeTableDto {
  readonly tableId: string;

  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;

  @ApiProperty({
    example: '20C',
    description: 'Номер стола',
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('number') })
  readonly number?: string;

  @ApiProperty({
    example: '2000',
    description: 'Цена',
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('price') })
  readonly price?: string;

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
