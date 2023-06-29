import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Главная')
@Controller('/')
export class AppController {
  @Get()
  app() {
    return 'Welcome to onyx api!';
  }
}
