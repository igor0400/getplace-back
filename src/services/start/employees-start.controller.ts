import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { EmployeesStartService } from './employees-start.service';
import { SecretGuard } from './guards/secret.guard';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { Response, Request } from 'express';
import { ApiDefaultResponse, ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('Стартер сотрудников')
@Controller('start/employees')
export class EmplayeesStartController {
  constructor(private startService: EmployeesStartService) {}

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
}
