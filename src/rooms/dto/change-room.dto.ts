import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class ChangeRoomDto {
  readonly roomId: string;

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
  @IsOptional()
  @IsString({ message: requestMessages.isString('title') })
  readonly title: string;
}
