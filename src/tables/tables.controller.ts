import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import {
  ApiDefaultResponse,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { TablesService } from './tables.service';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { PlaceRolesGuard } from 'src/roles/guards/place-roles.guard';
import { CreateTableDto } from './dto/create-table.dto';
import { ChangeTableDto } from './dto/change-table.dto';

@ApiTags('Столы')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @ApiDefaultResponse({ description: 'Получение всех столов' })
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
  getAllTables(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.tablesService.getAllTables(+limit, +offset, search);
  }

  @ApiDefaultResponse({
    description: 'Получение стола по id',
  })
  @ApiParam({
    name: 'id',
    description: 'id стола',
  })
  @Get(':id')
  getTableById(@Param('id') id: string) {
    return this.tablesService.getTableById(id);
  }

  @ApiDefaultResponse({
    description: 'Создание стола (только с ролью SEATS или OWNER)',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Post()
  createTable(@Body() dto: CreateTableDto) {
    return this.tablesService.createTable(dto);
  }

  @ApiDefaultResponse({
    description: 'Изменение стола (только с ролью SEATS или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id стола',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Patch(':id')
  changeTable(@Body() dto: ChangeTableDto, @Param('id') tableId: string) {
    return this.tablesService.changeTable({ ...dto, tableId });
  }

  @ApiDefaultResponse({
    description: 'Удаление стола (только с ролью SEATS или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id стола',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Delete(':id')
  deleteTable(@Param('id') id: string) {
    return this.tablesService.deleteTableById(id);
  }
}
