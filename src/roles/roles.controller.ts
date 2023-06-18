import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Patch,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ChangeRoleDto } from './dto/change-role.dto';
import { ApiDefaultResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EmployeesRoles } from './decorators/employees-roles.decorator';
import { EmployeeRolesGuard } from './guards/employee-roles.guard';

@ApiTags('Роли')
@EmployeesRoles('ADMIN')
@UseGuards(EmployeeRolesGuard)
@Controller('roles')
export class RolesController {
  constructor(private roleService: RolesService) {}

  @ApiDefaultResponse({
    description: 'Получение всех ролей (только с глобальной ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @Get()
  getAllRoles() {
    return this.roleService.getAllRoles();
  }

  @ApiDefaultResponse({
    description: 'Получение роли по id (только с глобальной ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @Get(':id')
  getRoleById(@Param('id', ParseIntPipe) roleId: string) {
    const role = this.roleService.getRoleById(roleId);

    if (role) {
      return role;
    } else {
      return `Роль с id: ${roleId} не найдена`;
    }
  }

  @ApiDefaultResponse({
    description: 'Создание роли (только с глобальной ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.roleService.createRole(dto);
  }

  @ApiDefaultResponse({
    description: 'Изменение роли по id (только с глобальной ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @Patch(':id')
  changeRole(
    @Body() dto: ChangeRoleDto,
    @Param('id', ParseIntPipe) roleId: string,
  ) {
    return this.roleService.changeRole({ ...dto, roleId });
  }
}
