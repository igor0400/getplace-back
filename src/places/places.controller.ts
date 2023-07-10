import {
  Controller,
  Param,
  Query,
  Req,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import {
  ApiAcceptedResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { ApiDefaultResponse } from '@nestjs/swagger';
import { UseGuards, Post, Body, Get } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { ModeratePlaceDto } from './dto/moderate-place.dto';
import { CustomReq } from 'src/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EmployeesRoles } from '../roles/decorators/employees-roles.decorator';
import { EmployeeRolesGuard } from '../roles/guards/employee-roles.guard';
import { PlacesRoles } from 'src/roles/decorators/places-roles.decorator';
import { ChangePlaceDto } from './dto/change-place.dto';
import { PlaceRolesUrlGuard } from 'src/roles/guards/place-roles-url.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Заведения')
@Controller('places')
export class PlacesController {
  constructor(private placesService: PlacesService) {}

  @ApiDefaultResponse({ description: 'Получение всех заведений' })
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
  @ApiQuery({
    name: 'accepted',
    description: 'Только принятые',
    required: false,
  })
  @ApiQuery({
    name: 'notAccepted',
    description: 'Только непринятые',
    required: false,
  })
  @Get()
  getAllPlaces(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
    @Query('accepted') accepted: boolean,
    @Query('notAccepted') notAccepted: boolean,
  ) {
    return this.placesService.getAllUpdatedPlaces(
      +limit,
      +offset,
      search,
      accepted,
      notAccepted,
    );
  }

  @ApiDefaultResponse({
    description: 'Создание заведения (только с Bearer токеном)',
  })
  @ApiAcceptedResponse({
    description: 'Загрузка до 5 файлов, поле image',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 5 }]))
  createPlace(
    @Body() dto: CreatePlaceDto,
    @Req() req: CustomReq,
    @UploadedFiles() files: { image: Express.Multer.File[] },
  ) {
    return this.placesService.createPlace(
      {
        ...dto,
        employeeId: req.user.sub,
      },
      files?.image,
    );
  }

  @ApiDefaultResponse({
    description: 'Изменение заведения (только с ролью SETTINGS или OWNER)',
  })
  @ApiAcceptedResponse({
    description: 'Загрузка до 5 файлов, поле image',
  })
  @ApiParam({
    name: 'id',
    description: 'id заведения',
  })
  @ApiBearerAuth('Only SETTINGS or OWNER roles')
  @PlacesRoles('OWNER', 'SETTINGS')
  @UseGuards(PlaceRolesUrlGuard)
  @Patch(':id')
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 5 }]))
  changePlace(
    @Body() dto: ChangePlaceDto,
    @Param('id') placeId: string,
    @UploadedFiles() files: { image: Express.Multer.File[] },
  ) {
    return this.placesService.changePlace({ ...dto, placeId }, files.image);
  }

  @ApiDefaultResponse({
    description: 'Удаление заведения (только с ролью OWNER)',
  })
  @ApiParam({
    name: 'id',
    description: 'id заведения',
  })
  @ApiBearerAuth('Only OWNER role')
  @PlacesRoles('OWNER')
  @UseGuards(PlaceRolesUrlGuard)
  @Delete(':id')
  deletePlace(@Param('id') id: string) {
    return this.placesService.deletePlaceById(id);
  }

  @ApiDefaultResponse({
    description: 'Получение заведения по id',
  })
  @ApiParam({
    name: 'id',
    description: 'id заведения',
  })
  @Get(':id')
  async getPlaceById(@Param('id') id: string) {
    const employee = await this.placesService.getUpdatedPlaceById(id);

    if (employee) {
      return employee;
    } else {
      return `Заведение с id: ${id} не найдено`;
    }
  }

  @ApiDefaultResponse({
    description: 'Модерация заведения (только с глобальной ролью ADMIN)',
  })
  @ApiParam({
    name: 'id',
    description: 'id заведения',
  })
  @ApiSecurity('ADMIN only')
  @EmployeesRoles('ADMIN')
  @UseGuards(EmployeeRolesGuard)
  @Post(':id/moderate')
  mederatePlace(@Body() dto: ModeratePlaceDto, @Param('id') placeId: string) {
    return this.placesService.moderatePlaceById({ ...dto, placeId });
  }
}
