import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';
import { EmployeeRolesGuard } from 'src/roles/guards/employee-roles.guard';
import { EmployeesRoles } from 'src/roles/decorators/employees-roles.decorator';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Файлы (только для админов)')
@EmployeesRoles('ADMIN')
@UseGuards(EmployeeRolesGuard)
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

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
  @ApiQuery({ name: 'search', description: 'Поиск по name', required: false })
  @Get()
  getAllFiles(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.filesService.getAllFiles(+limit, +offset, search);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  createFile(@UploadedFile() file: Express.Multer.File) {
    return this.filesService.createFile(file);
  }
}
