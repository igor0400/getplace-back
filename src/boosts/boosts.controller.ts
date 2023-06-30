import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Body,
  Param,
} from '@nestjs/common';
import { BoostsService } from './boosts.service';
import { ApiDefaultResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
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
  @Get()
  getAllBoosts() {
    return this.boostsService.getAllBoosts();
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
