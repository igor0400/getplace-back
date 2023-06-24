import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Table } from './table.model';
import { TableReservationUser } from './reservation-user.model';
import { reservationStatuses } from '../configs/reservation-statuses';
import { ReservationStatuses } from '../types/reservation-statuses';

export interface TableReservationCreationArgs {
  tableId: string;
  startDate: string;
  endDate: string;
  status?: ReservationStatuses;
}

@NestTable({ tableName: 'table_reservations' })
export class TableReservation extends AbstractModel<
  TableReservation,
  TableReservationCreationArgs
> {
  @ForeignKey(() => Table)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  tableId: string;

  @Column({
    type: DataType.ENUM(...reservationStatuses),
    defaultValue: 'CREATED',
  })
  status: ReservationStatuses;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: string;

  @HasMany(() => TableReservationUser)
  users: TableReservationUser[];
}
