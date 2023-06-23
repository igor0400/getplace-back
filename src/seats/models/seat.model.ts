import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Table } from 'src/tables/models/table.model';
import { SeatStates } from '../types/seat-states';
import { seatStates } from '../configs/seat-states';

export interface SeatCreationArgs {
  tableId: string;
  number: string;
  state?: SeatStates;
}

@NestTable({ tableName: 'table_seats' })
export class Seat extends AbstractModel<Seat, SeatCreationArgs> {
  @ForeignKey(() => Table)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tableId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  number: string;

  @Column({
    type: DataType.ENUM(...seatStates),
    defaultValue: 'free',
  })
  state: SeatStates;
}
