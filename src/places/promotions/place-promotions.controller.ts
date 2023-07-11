import { Controller, Param, Query, Delete } from '@nestjs/common';
import { ApiParam, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ApiDefaultResponse } from '@nestjs/swagger';
import { UseGuards, Post, Body, Get } from '@nestjs/common';
import { PromotionsService } from 'src/promotions/promotions.service';
import { CreatePromotionDto } from 'src/promotions/dto/create-promotion.dto';
import { PlaceRolesUrlGuard } from 'src/roles/guards/place-roles-url.guard';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';

@ApiTags('Акции заведения')
@Controller('places/:placeId/promotions')
export class PlacePromotionsController {
  constructor(private promotionsService: PromotionsService) {}

  @ApiDefaultResponse({ description: 'Получение всех акций заведения' })
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
  getAllPlaces(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
    @Param('placeId') placeId: string,
  ) {
    return this.promotionsService.getAllPromotions(+limit, +offset, search, {
      placeId,
    });
  }

  @ApiDefaultResponse({
    description:
      'Создание акции заведения (только с ролью PROMOTION или OWNER)',
  })
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @ApiSecurity('Only OWNER or PROMOTION roles')
  @PlacesRoles('OWNER', 'PROMOTION')
  @UseGuards(PlaceRolesUrlGuard)
  @Post()
  createPromotion(
    @Body() dto: CreatePromotionDto,
    @Param('placeId') placeId: string,
  ) {
    return this.promotionsService.createPromotion({
      ...dto,
      placeId,
    });
  }

  @ApiDefaultResponse({
    description:
      'Удаление акции заведения (только с ролью PROMOTION или OWNER)',
  })
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @ApiParam({
    name: 'promotionId',
    description: 'id акции',
  })
  @ApiSecurity('Only OWNER or PROMOTION roles')
  @PlacesRoles('OWNER', 'PROMOTION')
  @UseGuards(PlaceRolesUrlGuard)
  @Delete(':promotionId')
  deletePlace(@Param('promotionId') promotionId: string) {
    return this.promotionsService.deletePromotionById(promotionId);
  }
}
