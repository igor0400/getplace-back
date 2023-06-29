import { Controller, Post, Body, UseGuards, Delete } from '@nestjs/common';
import { PlaceBoostsService } from './place-boosts.service';
import {
  ApiBody,
  ApiDefaultResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePlaceBoostDto } from './dto/create-place-boost.dto';
import { PlaceRolesGuard } from 'src/roles/guards/place-roles.guard';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';

@ApiTags('Заведения')
@PlacesRoles('OWNER', 'PROMOTION')
@UseGuards(PlaceRolesGuard)
@Controller('places/boosts')
export class PlaceBoostsController {
  constructor(private readonly placeBoostsService: PlaceBoostsService) {}

  @ApiDefaultResponse({
    description:
      'Создание буста заведения (только с ролью в заведении PROMOTION или OWNER)',
  })
  @ApiBody({
    type: CreatePlaceBoostDto,
  })
  @ApiSecurity('OWNER or PROMOTION only')
  @Post()
  createPlaceBoost(@Body() dto: CreatePlaceBoostDto) {
    return this.placeBoostsService.createPlaceBoost(dto);
  }

  @ApiDefaultResponse({
    description:
      'Удаление буста заведения (только с ролью в заведении PROMOTION или OWNER)',
  })
  @ApiBody({
    type: CreatePlaceBoostDto,
  })
  @ApiSecurity('OWNER or PROMOTION only')
  @Delete()
  deletePlaceBoost(@Body() dto: CreatePlaceBoostDto) {
    return this.placeBoostsService.deletePlaceBoost(dto);
  }
}
