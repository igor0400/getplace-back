import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { requestMessages } from 'src/libs/common';
import { roleTypes } from 'src/roles/configs/roles';
import { RoleTypes } from 'src/roles/types/roles';

export class CreatePlaceEmployeeDto {
  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;

  @ApiProperty({
    example: 'employee@gmail.com',
    description: 'email сотрудника',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('employeeEmail') })
  @IsString({ message: requestMessages.isString('employeeEmail') })
  readonly employeeEmail: string;

  @ApiProperty({ example: 'Бургер', description: 'Название', maxLength: 50 })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('title') })
  @IsString({ message: requestMessages.isString('title') })
  @MaxLength(50, { message: requestMessages.maxLength('title', 50) })
  readonly title: string;

  @ApiProperty({
    example: ['MENU', 'SETTINGS'],
    description: 'Роли',
    enum: roleTypes,
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('roles') })
  @IsArray({ message: requestMessages.isArray('roles') })
  readonly roles: RoleTypes[];
}
