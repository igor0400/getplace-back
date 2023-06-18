import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FileCreationArgs, File } from '../models/file.model';

@Injectable()
export class FilesRepository extends AbstractRepository<
  File,
  FileCreationArgs
> {
  protected readonly logger = new Logger(File.name);

  constructor(
    @InjectModel(File)
    private fileModel: typeof File,
  ) {
    super(fileModel);
  }
}
