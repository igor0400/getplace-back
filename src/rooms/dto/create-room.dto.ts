import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @ApiProperty({
    example: 'Обычный зал',
    description: 'Описание зала',
  })
  @IsOptional()
  @IsString({ message: requestMessages.isString('description') })
  readonly description?: string;

  @ApiProperty({
    example: 6,
    description: 'Максимальное кол-во столов по оси X',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('maxPositionsX') })
  @IsNumber({}, { message: requestMessages.isNumber('maxPositionsX') })
  readonly maxPositionsX: number;

  @ApiProperty({
    example: 5,
    description: 'Максимальное кол-во столов по оси Y',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('maxPositionsY') })
  @IsNumber({}, { message: requestMessages.isNumber('maxPositionsY') })
  readonly maxPositionsY: number;
}
