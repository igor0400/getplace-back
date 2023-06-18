import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { requestMessages } from 'src/libs/common';

export class AddRoleDto {
  @ApiProperty({ example: 'ADMIN', description: 'Название роли' })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('value') })
  @IsString({ message: requestMessages.isString('value') })
  readonly value: string;

  @ApiProperty({
    example: 'fsdhuiUHDIUS-DKJASOIDJOIADJammc',
    description: 'id создателя',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('employeeId') })
  @IsString({ message: requestMessages.isString('employeeId') })
  readonly employeeId: string;
}
