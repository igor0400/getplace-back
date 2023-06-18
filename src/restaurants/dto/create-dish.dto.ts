import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDishDto } from 'src/dishes/dto/create-dish.dto';
import { requestMessages } from 'src/libs/common';

export class CreateRestaurantDishDto extends CreateDishDto {
  @ApiProperty({
    example: 'id заведения',
    description: 'placeId',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;
}
