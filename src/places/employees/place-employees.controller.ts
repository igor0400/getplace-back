import { Controller, Param, Query, Patch, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiDefaultResponse } from '@nestjs/swagger';
import { UseGuards, Post, Body, Get } from '@nestjs/common';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { CreatePlaceEmployeeDto } from './dto/create-place-employee.dto';
import { ChangePlaceEmployeeDto } from './dto/change-place-employee.dto';
import { PlaceEmployeesService } from './place-employees.service';
import { PlaceRolesUrlGuard } from 'src/roles/guards/place-roles-url.guard';

@ApiTags('Сотрудники заведения')
@Controller('places/:placeId/employees')
export class PlaceEmployeesController {
  constructor(private placeEmployeesService: PlaceEmployeesService) {}

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
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @Get()
  getAllUsers(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Param('placeId') placeId: string,
  ) {
    return this.placeEmployeesService.getAllEmployees(placeId, +limit, +offset);
  }

  @ApiDefaultResponse({
    description: 'Добавление сотрудника (только с ролью OWNER)',
  })
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @ApiSecurity('OWNER only')
  @PlacesRoles('OWNER')
  @UseGuards(PlaceRolesUrlGuard)
  @Post()
  createEmployee(
    @Body() dto: CreatePlaceEmployeeDto,
    @Param('placeId') placeId: string,
  ) {
    return this.placeEmployeesService.createEmployee({ ...dto, placeId });
  }

  @ApiDefaultResponse({
    description: 'Изменение сотрудника (только с ролью OWNER)',
  })
  @ApiParam({
    name: 'placeEmployeeId',
    description: 'id сотрудника заведения',
  })
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @ApiSecurity('OWNER only')
  @PlacesRoles('OWNER')
  @UseGuards(PlaceRolesUrlGuard)
  @Patch(':placeEmployeeId')
  changeEmployee(
    @Body() dto: ChangePlaceEmployeeDto,
    @Param('placeEmployeeId') placeEmployeeId: string,
    @Param('placeId') placeId: string,
  ) {
    return this.placeEmployeesService.changeEmployee({
      ...dto,
      placeEmployeeId,
      placeId,
    });
  }

  @ApiDefaultResponse({
    description: 'Удаление сотрудника (только с ролью OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id сотрудника заведения',
  })
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @ApiSecurity('OWNER only')
  @PlacesRoles('OWNER')
  @UseGuards(PlaceRolesUrlGuard)
  @Delete(':placeEmployeeId')
  deleteEmployee(@Param('placeEmployeeId') placeEmployeeId: string) {
    return this.placeEmployeesService.deleteEmployee(placeEmployeeId);
  }
}
