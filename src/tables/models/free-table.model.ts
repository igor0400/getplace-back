import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Place } from 'src/places/models/place.model';
import { Table } from './table.model';

export interface FreeTableCreationArgs {
  placeId: string;
  tableId: string;
}

@NestTable({ tableName: 'free_tables', timestamps: false })
export class FreeTable extends AbstractModel<FreeTable, FreeTableCreationArgs> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @ForeignKey(() => Table)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tableId: string;
}
