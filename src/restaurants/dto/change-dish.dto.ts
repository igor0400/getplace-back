import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { ChangeDishDto } from 'src/dishes/dto/change-dish.dto';
import { requestMessages } from 'src/libs/common';

export class ChangeRestaurantDishDto extends ChangeDishDto {
  @ApiProperty({
    example: 'id заведения',
    description: 'placeId',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;
}
