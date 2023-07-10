import { Controller, Param, Query } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ApiDefaultResponse } from '@nestjs/swagger';
import { Get } from '@nestjs/common';
import { RestaurantMenuService } from './restaurant-menu.service';

@ApiTags('Меню ресторана')
@Controller('restaurants/:restaurantInfoId/menu')
export class RestaurantMenuController {
  constructor(private restaurantMenuService: RestaurantMenuService) {}

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
  @ApiParam({
    name: 'restaurantInfoId',
    description: 'id restaurantInfo',
  })
  @Get()
  getAllPlaceReviews(
    @Param('restaurantInfoId') restaurantInfoId: string,
    @Query('limit') limit: string,
    @Query('offset') offset: string,
  ) {
    return this.restaurantMenuService.getRestaurantMenu(
      restaurantInfoId,
      +limit,
      +offset,
    );
  }
}
