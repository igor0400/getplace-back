import { Controller, Param, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { ApiDefaultResponse } from '@nestjs/swagger';
import { UseGuards, Post, Body, Get } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { ModeratePlaceDto } from './dto/moderate-place.dto';
import { CustomReq } from 'src/libs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeesRoles } from '../roles/decorators/employees-roles.decorator';
import { EmployeeRolesGuard } from '../roles/guards/employee-roles.guard';

@ApiTags('Заведения')
@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @ApiDefaultResponse({ description: 'Получение всех заведений' })
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
  @ApiQuery({
    name: 'search',
    description: 'Поиск по названию',
    required: false,
  })
  @Get()
  getAllPlaces(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.placesService.getAllPlaces(+limit, +offset, search);
  }

  @ApiDefaultResponse({
    description: 'Создание заведения (только с Bearer токеном)',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Post()
  createPlace(@Body() dto: CreatePlaceDto, @Req() req: CustomReq) {
    return this.placesService.createPlace({
      ...dto,
      employeeId: req.user.sub,
    });
  }

  @ApiDefaultResponse({
    description: 'Получение заведения по id',
  })
  @Get(':id')
  async getPlaceById(@Param('id') id: string) {
    const employee = await this.placesService.getPlaceById(id);

    if (employee) {
      return employee;
    } else {
      return `Заведение с id: ${id} не найдено`;
    }
  }

  @ApiDefaultResponse({
    description: 'Модерация заведения (только с глобальной ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @EmployeesRoles('ADMIN')
  @UseGuards(EmployeeRolesGuard)
  @Post(':id/moderate')
  mederatePlace(@Body() dto: ModeratePlaceDto, @Param('id') placeId: string) {
    return this.placesService.moderatePlaceById({ ...dto, placeId });
  }
}
