import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Table } from './table.model';
import { TableReservation } from './reservation.model';
import { reservationUserRoles } from '../configs/reservation-user-roles';
import { ReservationUserRoles } from '../types/reservation-user-roles';
import { User } from 'src/users/models/user.model';

export interface ReservationUserCreationArgs {
  reservationId: string;
}

@NestTable({ tableName: 'table_reservation_users' })
export class ReservationUser extends AbstractModel<
  ReservationUser,
  ReservationUserCreationArgs
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
}
