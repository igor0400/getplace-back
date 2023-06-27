import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CreateDishDto } from 'src/dishes/dto/create-dish.dto';
import { requestMessages } from 'src/common';

export class CreateRestaurantDishDto extends CreateDishDto {
  @ApiProperty({
    example: 'uiuhicdcdsc-3r3fnzdjvnso-3e3e3njc-2eqfndkcn',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;
}
