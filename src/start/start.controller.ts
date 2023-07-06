import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StartService } from './start.service';
import { SecretGuard } from './guards/secret.guard';
import { Response, Request } from 'express';
import { ApiDefaultResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { CreateTestDataDto } from './dto/create-test-data.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('Стартер')
@Controller('start')
export class StartController {
  constructor(private startService: StartService) {}

  @ApiDefaultResponse({
    description: 'Создание первичных данных (только с секретным ключом)',
  })
  @ApiSecurity('secret key')
  @UseGuards(SecretGuard)
  @Post()
  createInitialData(
    @Body() dto: CreateInitialDataDto,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.startService.createInitialData(dto, response, request);
  }

  @ApiDefaultResponse({
    description: 'Создание тестовых данных (только с секретным ключом)',
  })
  @ApiSecurity('secret key')
  @UseGuards(SecretGuard)
  @Post('test')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'placeImage', maxCount: 5 },
      { name: 'dishImage', maxCount: 1 },
    ]),
  )
  createTestData(
    @Body() dto: CreateTestDataDto,
    @UploadedFiles()
    files: {
      placeImage?: Express.Multer.File[];
      dishImage?: Express.Multer.File[];
    },
  ) {
    return this.startService.createTestData(dto, files);
  }
}
