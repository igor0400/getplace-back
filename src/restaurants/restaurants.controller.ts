import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
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
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Рестораны (заведения)')
@PlacesRoles('MENU', 'OWNER')
@UseGuards(PlaceRolesGuard)
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @ApiDefaultResponse({
    description: 'Создание блюда (только с ролью MENU или OWNER)',
  })
  @ApiAcceptedResponse({
    description: 'Загрузка 1 файла, поле image',
  })
  @ApiSecurity('MENU or OWNER only')
  @Post('dishes')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  createDish(
    @Body() dto: CreateRestaurantDishDto,
    @UploadedFiles() files: { image: Express.Multer.File[] },
  ) {
    return this.restaurantsService.createDish(dto, files.image);
  }

  @ApiDefaultResponse({
    description: 'Изменение блюда (только с ролью MENU или OWNER)',
  })
  @ApiAcceptedResponse({
    description: 'Загрузка 1 файла, поле image',
  })
  @ApiParam({
    name: 'id',
    description: 'id блюда',
  })
  @ApiSecurity('MENU or OWNER only')
  @Patch('dishes/:id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  changeDish(
    @Body() dto: ChangeRestaurantDishDto,
    @Param('id') dishId: string,
    @UploadedFiles() files: { image: Express.Multer.File[] },
  ) {
    return this.restaurantsService.changeDish({ ...dto, dishId }, files.image);
  }

  @ApiDefaultResponse({
    description: 'Удаление блюда (только с ролью MENU или OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id блюда',
  })
  @ApiSecurity('MENU or OWNER only')
  @Delete('dishes/:id')
  deleteDish(@Param('id') id: string) {
    return this.restaurantsService.deleteDishById(id);
  }
}
