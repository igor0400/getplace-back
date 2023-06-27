import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { WorkDays, WorkDaysCreationArgs } from '../models/work-days.model';

@Injectable()
export class WorkDaysRepository extends AbstractRepository<
  WorkDays,
  WorkDaysCreationArgs
> {
  protected readonly logger = new Logger(WorkDays.name);

  constructor(
    @InjectModel(WorkDays)
    private workDaysModel: typeof WorkDays,
  ) {
    super(workDaysModel);
  }
}
