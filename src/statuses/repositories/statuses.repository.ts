import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Status, StatusCreationArgs } from '../models/status.model';

@Injectable()
export class StatusRepository extends AbstractRepository<
  Status,
  StatusCreationArgs
> {
  protected readonly logger = new Logger(Status.name);

  constructor(
    @InjectModel(Status)
    private statusModel: typeof Status,
  ) {
    super(statusModel);
  }
}
