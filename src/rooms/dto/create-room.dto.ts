import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class CreateRoomDto {
  @ApiProperty({
    example: 'djsnfjsnf-fdsfsdf3dfs-f3fw3fijd-fdsfwjnfi',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;

  @ApiProperty({
    example: 'VIP зал',
    description: 'Название зала',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('title') })
  @IsString({ message: requestMessages.isString('title') })
  readonly title: string;
}
