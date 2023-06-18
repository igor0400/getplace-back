import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiDefaultResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { PlaceRolesGuard } from 'src/roles/guards/place-roles.guard';
import { CreateRestaurantDishDto } from './dto/create-dish.dto';
import { RestaurantsService } from './restaurants.service';

@ApiTags('Рестораны (заведения)')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ApiDefaultResponse({
    description: 'Создание блюда (только с ролью MENU или OWNER)',
  })
  @ApiSecurity('MENU or OWNER only')
  @PlacesRoles('MENU', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Post('dishes')
  createDish(@Body() dto: CreateRestaurantDishDto) {
    return this.restaurantsService.createDish(dto);
  }
}
