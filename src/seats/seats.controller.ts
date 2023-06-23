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
import { SeatsService } from './seats.service';
import {
  ApiDefaultResponse,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PlaceRolesGuard } from 'src/roles/guards/place-roles.guard';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { CreateSeatDto } from './dto/create-seat.dto';
import { ChangeSeatDto } from './dto/change-seat.dto';

@ApiTags('Места')
@Controller('seats')
export class SeatsController {
  constructor(private readonly seatsService: SeatsService) {}

  @ApiDefaultResponse({ description: 'Получение всех мест' })
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
  getAllSeats(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.seatsService.getAllSeats(+limit, +offset, search);
  }

  @ApiDefaultResponse({
    description: 'Получение места по id',
  })
  @ApiParam({
    name: 'id',
    description: 'id места',
  })
  @Get(':id')
  getSeatById(@Param('id') id: string) {
    return this.seatsService.getSeatById(id);
  }

  @ApiDefaultResponse({
    description: 'Создание места (только с ролью SEATS или OWNER)',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Post()
  createSeat(@Body() dto: CreateSeatDto) {
    return this.seatsService.createSeat(dto);
  }

  @ApiDefaultResponse({
    description: 'Изменение места (только с ролью SEATS или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id места',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Patch(':id')
  changeSeat(@Body() dto: ChangeSeatDto, @Param('id') seatId: string) {
    return this.seatsService.changeSeat({ ...dto, seatId });
  }

  @ApiDefaultResponse({
    description: 'Удаление места (только с ролью SEATS или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id места',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Delete(':id')
  deleteSeat(@Param('id') id: string) {
    return this.seatsService.deleteSeatById(id);
  }
}
