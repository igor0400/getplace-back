import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { BoostsService } from './boosts.service';
import {
  ApiDefaultResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { EmployeesRoles } from 'src/roles/decorators/employees-roles.decorator';
import { EmployeeRolesGuard } from 'src/roles/guards/employee-roles.guard';
import { CreateBoostDto } from './dto/create-boost.dto';
import { ChangeBoostDto } from './dto/change-boost.dto';

@ApiTags('Продвижение (только с глобальной ролью ADMIN)')
@ApiSecurity('ADMIN only')
@EmployeesRoles('ADMIN')
@UseGuards(EmployeeRolesGuard)
@Controller('boosts')
export class BoostsController {
  constructor(private readonly boostsService: BoostsService) {}

  @ApiDefaultResponse({
    description: 'Получение всех бустов',
  })
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
  getAllBoosts(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.boostsService.getAllBoosts(+limit, +offset, search);
  }

  @ApiDefaultResponse({
    description: 'Получение буста по id',
  })
  @Get(':id')
  getBoostById(@Param('id') boostId: string) {
    const boost = this.boostsService.getBoostById(boostId);

    if (boost) {
      return boost;
    } else {
      return `Буст с id: ${boostId} не найден`;
    }
  }

  @ApiDefaultResponse({
    description: 'Создание буста',
  })
  @Post()
  createBoost(@Body() dto: CreateBoostDto) {
    return this.boostsService.createBoost(dto);
  }

  @ApiDefaultResponse({
    description: 'Изменение буста по id',
  })
  @Patch(':id')
  changeBoost(@Body() dto: ChangeBoostDto, @Param('id') boostId: string) {
    return this.boostsService.changeBoost({ ...dto, boostId });
  }
}
