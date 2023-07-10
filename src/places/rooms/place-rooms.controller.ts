import { Controller, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiDefaultResponse } from '@nestjs/swagger';
import { Get } from '@nestjs/common';
import { RoomsService } from 'src/rooms/rooms.service';

@ApiTags('Залы заведения')
@Controller('places/:placeId/rooms')
export class PlaceRoomsController {
  constructor(private roomsService: RoomsService) {}

  @ApiDefaultResponse({ description: 'Получение всех залов заведения' })
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
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @Get()
  getAllPlaceReviews(
    @Param('placeId') placeId: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.roomsService.getAllRooms(+limit, +offset, search, {
      placeId,
    });
  }
}
