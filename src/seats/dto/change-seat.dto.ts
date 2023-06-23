import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { seatStates } from '../configs/seat-states';
import { SeatStates } from '../types/seat-states';
import { requestMessages } from 'src/libs/common';

export class ChangeSeatDto {
  readonly seatId: string;

  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;

  @ApiProperty({
    example: '20C',
    description: 'Номер места',
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('number') })
  readonly number?: string;

  @ApiProperty({
    example: 'free',
    description: 'Состояние места',
    default: 'free',
    required: false,
    enum: seatStates,
  })
  @IsOptional()
  @IsEnum(seatStates, { message: requestMessages.isEnum('state', seatStates) })
  readonly state?: SeatStates;
}
