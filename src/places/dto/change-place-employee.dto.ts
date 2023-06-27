import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { requestMessages } from 'src/common';
import { roleTypes } from 'src/roles/configs/roles';
import { RoleTypes } from 'src/roles/types/roles';

export class ChangePlaceEmployeeDto {
  readonly placeEmployeeId: string;

  @ApiProperty({
    example: 'fygdwf76-dfdsfs-dfsf-fdsf',
    description: 'id заведения',
  })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('placeId') })
  @IsString({ message: requestMessages.isString('placeId') })
  readonly placeId: string;

  @ApiProperty({ example: 'Бургер', description: 'Название', maxLength: 50 })
  @IsNotEmpty({ message: requestMessages.isNotEmpty('title') })
  @IsOptional()
  @MaxLength(50, { message: requestMessages.maxLength('title', 50) })
  readonly title?: string;

  @ApiProperty({
    example: ['MENU', 'SETTINGS'],
    description: 'Роли',
    enum: roleTypes,
  })
  @IsOptional()
  @IsArray({ message: requestMessages.isArray('roles') })
  readonly roles?: RoleTypes[];
}
