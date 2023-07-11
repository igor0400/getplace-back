import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class CreatePlaceBoostDto {
  readonly placeId: string;

  @ApiProperty({
    example: 'YELLOW_FRAME',
    description: 'Название буста',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('boostValue') })
  @IsString({ message: requestMessages.isString('boostValue') })
  readonly boostValue: string;
}
