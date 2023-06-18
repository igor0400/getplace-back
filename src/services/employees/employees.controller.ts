import {
  Param,
  Controller,
  Delete,
  Get,
  UseGuards,
  Post,
  Body,
  Query,
  Patch,
  Req,
} from '@nestjs/common';
import { CustomReq } from 'src/libs/common';
import { AddRoleDto } from './dto/add-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeEmployeeDto } from './dto/change-employee.dto';
import { EmployeesService } from './employees.service';
import {
  ApiBearerAuth,
  ApiDefaultResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeesRoles } from '../roles/decorators/employees-roles.decorator';
import { EmployeeRolesGuard } from '../roles/guards/employee-roles.guard';

@ApiTags('Сотрудники')
@Controller('employees')
export class EmployeesController {
  constructor(private employeesService: EmployeesService) {}

  @ApiDefaultResponse({ description: 'Получение всех сотрудников' })
  @ApiQuery({
    name: 'limit',
    description: 'Ограничение колличества',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Отступ от начала',
    required: false,
  })
  @ApiQuery({ name: 'search', description: 'Поиск по email', required: false })
  @Get()
  getAllEmployees(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.employeesService.getAllEmployees(+limit, +offset, search);
  }

  @ApiDefaultResponse({
    description: 'Изменение сотрудника (только с Bearer токеном)',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Patch()
  changeEmployee(@Body() dto: ChangeEmployeeDto, @Req() req: CustomReq) {
    return this.employeesService.changeEmployee({
      ...dto,
      employeeId: req.user.sub,
    });
  }

  @ApiDefaultResponse({
    description: 'Добывление роли сотруднику (только с глобальной ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @EmployeesRoles('ADMIN')
  @UseGuards(EmployeeRolesGuard)
  @Post('add-role')
  addRole(@Body() dto: AddRoleDto) {
    return this.employeesService.addRole(dto);
  }

  @ApiDefaultResponse({
    description: 'Изменение пароля (только с Bearer токеном)',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Patch('change-pass')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req: CustomReq) {
    return this.employeesService.changePassword({
      ...dto,
      employeeId: req.user.sub,
    });
  }

  @ApiDefaultResponse({
    description: 'Получение сотрудника по id',
  })
  @Get(':id')
  async getEmployeeById(@Param('id') id: string) {
    const employee = await this.employeesService.getEmployeeById(id);

    if (employee) {
      return employee;
    } else {
      return `Пользователь с id: ${id} не найден`;
    }
  }

  @ApiDefaultResponse({
    description: 'Удаление сотрудника (только с глобальной ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @EmployeesRoles('ADMIN')
  @UseGuards(EmployeeRolesGuard)
  @Delete(':id')
  deleteEmployeeById(@Param('id') id: string) {
    return this.employeesService.deleteEmployeeById(id);
  }
}
