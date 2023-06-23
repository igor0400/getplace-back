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
import { RoomsService } from './rooms.service';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { PlaceRolesGuard } from 'src/roles/guards/place-roles.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { ChangeRoomDto } from './dto/change-room.dto';

@ApiTags('Залы')
@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @ApiDefaultResponse({ description: 'Получение всех залов' })
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
  getAllRooms(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.roomsService.getAllRooms(+limit, +offset, search);
  }

  @ApiDefaultResponse({
    description: 'Получение зала по id',
  })
  @ApiParam({
    name: 'id',
    description: 'id зала',
  })
  @Get(':id')
  getRoomById(@Param('id') id: string) {
    return this.roomsService.getRoomById(id);
  }

  @ApiDefaultResponse({
    description: 'Создание зала (только с ролью SEATS или OWNER)',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Post()
  createRoom(@Body() dto: CreateRoomDto) {
    return this.roomsService.createRoom(dto);
  }

  @ApiDefaultResponse({
    description: 'Изменение зала (только с ролью SEATS или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id зала',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Patch(':id')
  changeRoom(@Body() dto: ChangeRoomDto, @Param('id') roomId: string) {
    return this.roomsService.changeRoom({ ...dto, roomId });
  }

  @ApiDefaultResponse({
    description: 'Удаление зала (только с ролью SEATS или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id зала',
  })
  @ApiSecurity('Only SEATS or OWNER roles')
  @PlacesRoles('SEATS', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Delete(':id')
  deleteRoom(@Param('id') id: string) {
    return this.roomsService.deleteRoomById(id);
  }
}
