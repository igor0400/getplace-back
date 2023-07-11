import {
  Controller,
  Post,
  Body,
  UseGuards,
  Delete,
  Param,
} from '@nestjs/common';
import { PlaceBoostsService } from './place-boosts.service';
import {
  ApiBody,
  ApiDefaultResponse,
  ApiParam,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePlaceBoostDto } from './dto/create-place-boost.dto';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { PlaceRolesUrlGuard } from 'src/roles/guards/place-roles-url.guard';

@ApiTags('Бусты заведения')
@PlacesRoles('OWNER', 'PROMOTION')
@UseGuards(PlaceRolesUrlGuard)
@Controller('places/:placeId/boosts')
export class PlaceBoostsController {
  constructor(private readonly placeBoostsService: PlaceBoostsService) {}

  @ApiDefaultResponse({
    description:
      'Создание буста заведения (только с ролью в заведении PROMOTION или OWNER)',
  })
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @ApiBody({
    type: CreatePlaceBoostDto,
  })
  @ApiSecurity('OWNER or PROMOTION only')
  @Post()
  createPlaceBoost(
    @Body() dto: CreatePlaceBoostDto,
    @Param('placeId') placeId: string,
  ) {
    return this.placeBoostsService.createPlaceBoost({ ...dto, placeId });
  }

  @ApiDefaultResponse({
    description:
      'Удаление буста заведения (только с ролью в заведении PROMOTION или OWNER)',
  })
  @ApiParam({
    name: 'placeId',
    description: 'id заведения',
  })
  @ApiParam({
    name: 'boostValue',
    description: 'Название буста',
  })
  @ApiSecurity('OWNER or PROMOTION only')
  @Delete(':boostValue')
  deletePlaceBoost(
    @Param('placeId') placeId: string,
    @Param('boostValue') boostValue: string,
  ) {
    return this.placeBoostsService.deletePlaceBoost({ boostValue, placeId });
  }
}
