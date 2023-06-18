import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/libs/common';
import { FilesRepository } from './repositories';
import { File } from './models/file.model';

@Module({
  imports: [DatabaseModule.forFeature([File])],
  providers: [FilesRepository],
  exports: [FilesRepository],
})
export class FilesModule {}
