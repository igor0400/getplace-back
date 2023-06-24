import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { TableStates } from '../types/table-states';
import { tableStates } from '../configs/table-states';
import { Room } from 'src/rooms/models/room.model';
import { Seat } from 'src/seats/models/seat.model';
import { TableReservation } from './reservation.model';

export interface TableCreationArgs {
  roomId: string;
  number: string;
  price?: string;
  state?: TableStates;
}

@NestTable({ tableName: 'room_tables' })
export class Table extends AbstractModel<Table, TableCreationArgs> {
  @ForeignKey(() => Room)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  roomId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  number: string;

  @Column({
    type: DataType.STRING,
  })
  price: string;

  @Column({
    type: DataType.ENUM(...tableStates),
    defaultValue: 'free',
  })
  state: TableStates;

  @HasMany(() => Seat)
  seats: Seat[];

  @HasMany(() => TableReservation)
  reservations: TableReservation[];
}
