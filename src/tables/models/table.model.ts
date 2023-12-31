import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { TableStates } from '../types/table-states';
import { tableStates } from '../configs/table-states';
import { Room } from 'src/rooms/models/room.model';
import { Seat } from 'src/seats/models/seat.model';
import { TableReservation } from 'src/reservations/models/table-reservation.model';

export interface TableCreationArgs {
  roomId: string;
  number: string;
  positionX: number;
  positionY: number;
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
    type: DataType.INTEGER,
    allowNull: false,
  })
  positionX: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  positionY: number;

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
