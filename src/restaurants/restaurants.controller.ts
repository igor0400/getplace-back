import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiDefaultResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { PlaceRolesGuard } from 'src/roles/guards/place-roles.guard';
import { CreateRestaurantDishDto } from './dto/create-dish.dto';
import { RestaurantsService } from './restaurants.service';
import { ChangeRestaurantDishDto } from './dto/change-dish.dto';

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

  @ApiDefaultResponse({
    description: 'Изменение блюда (только с ролью MENU или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id блюда',
  })
  @ApiSecurity('MENU or OWNER only')
  @PlacesRoles('MENU', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Patch('dishes/:id')
  changeDish(
    @Body() dto: ChangeRestaurantDishDto,
    @Param('id') dishId: string,
  ) {
    return this.restaurantsService.changeDish({ ...dto, dishId });
  }

  @ApiDefaultResponse({
    description: 'Удаление блюда (только с ролью MENU или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id блюда',
  })
  @ApiSecurity('MENU or OWNER only')
  @PlacesRoles('MENU', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Delete('dishes/:id')
  deleteDish(@Param('id') id: string) {
    return this.restaurantsService.deleteDishById(id);
  }
}
