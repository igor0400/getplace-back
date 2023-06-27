import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/common';
import { FileRepository } from './repositories/file.repository';
import { File } from './models/file.model';
import { FilesController } from './files.controller';
import { StorageModule } from 'src/storage/storage.module';
import { FilesService } from './files.service';
import { EmployeesModule } from 'src/employees/employees.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule.forFeature([File]),
    StorageModule,
    EmployeesModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
  ],
  controllers: [FilesController],
  providers: [FileRepository, FilesService],
  exports: [FileRepository, FilesService],
})
export class FilesModule {}
