import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/common';

export class CreatePlaceBoostDto {
  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;

  @ApiProperty({
    example: 'YELLOW_FRAME',
    description: 'Название буста',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('boostValue') })
  @IsString({ message: requestMessages.isString('boostValue') })
  readonly boostValue: string;
}
