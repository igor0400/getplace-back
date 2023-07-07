import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiDefaultResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CustomReq } from 'src/common';
import { FavouritesService } from './favourites.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Избранное')
@UseGuards(JwtAuthGuard)
@Controller('favourites')
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @ApiDefaultResponse({
    description: 'Получение избранных заведений пользователя',
  })
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
  @Get('places')
  getAllUserFavouritePlaces(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Req() req: CustomReq,
  ) {
    return this.favouritesService.getAllUserFavouritePlaces(
      req.user.sub,
      +limit,
      +offset,
    );
  }

  @ApiDefaultResponse({
    description: 'Создание избранного заведения пользователя',
  })
  @Post('places/:placeId')
  createUserFavouritePlace(
    @Req() req: CustomReq,
    @Param('placeId') placeId: string,
  ) {
    return this.favouritesService.createUserFavouritePlace({
      userId: req.user.sub,
      placeId,
    });
  }

  @ApiDefaultResponse({
    description: 'Удаление избранного заведения пользователя',
  })
  @Delete('places/:placeId')
  deleteUserFavouritePlace(
    @Req() req: CustomReq,
    @Param('placeId') placeId: string,
  ) {
    return this.favouritesService.deleteUserFavouritePlace({
      userId: req.user.sub,
      placeId,
    });
  }
}
