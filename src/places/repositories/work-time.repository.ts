import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkTime, WorkTimeCreationArgs } from '../models/work-time.model';

@Injectable()
export class WorkTimeRepository extends AbstractRepository<
  WorkTime,
  WorkTimeCreationArgs
> {
  protected readonly logger = new Logger(WorkTime.name);

  constructor(
    @InjectModel(WorkTime)
    private workTimeModel: typeof WorkTime,
  ) {
    super(workTimeModel);
  }
}
