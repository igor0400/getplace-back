import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiDefaultResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { PlaceRolesGuard } from 'src/roles/guards/place-roles.guard';

@ApiTags('Рестораны (заведения)')
@Controller('restaurants')
export class RestaurantsController {
  @ApiDefaultResponse({
    description: 'Создание блюда (только с ролью MENU или OWNER)',
  })
  @ApiSecurity('MENU or OWNER only')
  @PlacesRoles('MENU', 'OWNER')
  @UseGuards(PlaceRolesGuard)
  @Post('dishes')
  createDish() {
    return 'success!';
  }
}
