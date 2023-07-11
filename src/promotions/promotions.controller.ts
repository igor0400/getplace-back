import { Controller, Get, Query } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { ApiDefaultResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Акции')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @ApiDefaultResponse({ description: 'Получение всех акций' })
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
    return this.promotionsService.getAllPromotions(+limit, +offset, search);
  }
}
