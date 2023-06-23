import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Table, TableCreationArgs } from '../models/table.model';

@Injectable()
export class TableRepository extends AbstractRepository<
  Table,
  TableCreationArgs
> {
  protected readonly logger = new Logger(Table.name);

  constructor(
    @InjectModel(Table)
    private tableModel: typeof Table,
  ) {
    super(tableModel);
  }
}
