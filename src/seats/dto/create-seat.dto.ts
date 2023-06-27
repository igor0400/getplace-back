import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class CreateSeatDto {
  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;

  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id стола',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('tableId') })
  @IsString({ message: requestMessages.isString('tableId') })
  readonly tableId: string;

  @ApiProperty({
    example: '20C',
    description: 'Номер места',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('number') })
  @IsString({ message: requestMessages.isString('number') })
  readonly number: string;
}
