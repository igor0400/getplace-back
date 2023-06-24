import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Table } from 'src/tables/models/table.model';
import { SeatReservation } from './reservation.model';

export interface SeatCreationArgs {
  tableId: string;
  number: string;
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

  @HasMany(() => SeatReservation)
  reservations: SeatReservation[];
}
