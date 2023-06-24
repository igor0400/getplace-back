import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Table } from './table.model';
import { TableReservation } from './reservation.model';
import { reservationUserRoles } from '../configs/reservation-user-roles';
import { ReservationUserRoles } from '../types/reservation-user-roles';
import { User } from 'src/users/models/user.model';

export interface TableReservationUserCreationArgs {
  reservationId: string;
  userId: string;
  role: ReservationUserRoles;
}

@NestTable({ tableName: 'table_reservation_users' })
export class TableReservationUser extends AbstractModel<
  TableReservationUser,
  TableReservationUserCreationArgs
> {
  @ForeignKey(() => TableReservation)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reservationId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.ENUM(...reservationUserRoles),
    allowNull: false,
  })
  role: ReservationUserRoles;

  @BelongsTo(() => User)
  userData: User;
}
