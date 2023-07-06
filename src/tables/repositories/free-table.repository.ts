import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FreeTable, FreeTableCreationArgs } from '../models/free-table.model';

@Injectable()
export class FreeTableRepository extends AbstractRepository<
  FreeTable,
  FreeTableCreationArgs
> {
  protected readonly logger = new Logger(FreeTable.name);

  constructor(
    @InjectModel(FreeTable)
    private freeTableModel: typeof FreeTable,
  ) {
    super(freeTableModel);
  }
}
