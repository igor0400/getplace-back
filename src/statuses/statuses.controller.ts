import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { ApiDefaultResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { EmployeesRoles } from 'src/roles/decorators/employees-roles.decorator';
import { EmployeeRolesGuard } from 'src/roles/guards/employee-roles.guard';
import { ChangeStatusDto } from './dto/change-status.dto';

@ApiTags('Статусы (только с глобальной ролью ADMIN)')
@ApiSecurity('ADMIN only')
@EmployeesRoles('ADMIN')
@UseGuards(EmployeeRolesGuard)
@Controller('statuses')
export class StatusesController {
  constructor(private readonly statusesService: StatusesService) {}

  @ApiDefaultResponse({
    description: 'Получение всех статусов',
  })
  @Get()
  getAllStatuses() {
    return this.statusesService.getAllStatuses();
  }

  @ApiDefaultResponse({
    description: 'Получение статуса по id',
  })
  @Get(':id')
  getStatusById(@Param('id') statusId: string) {
    const status = this.statusesService.getStatusById(statusId);

    if (status) {
      return status;
    } else {
      return `Статус с id: ${statusId} не найден`;
    }
  }

  @ApiDefaultResponse({
    description: 'Создание статуса',
  })
  @Post()
  create(@Body() dto: CreateStatusDto) {
    return this.statusesService.createStatus(dto);
  }

  @ApiDefaultResponse({
    description: 'Изменение статуса по id',
  })
  @Patch(':id')
  changeStatus(@Body() dto: ChangeStatusDto, @Param('id') statusId: string) {
    return this.statusesService.changeStatus({ ...dto, statusId });
  }
}
