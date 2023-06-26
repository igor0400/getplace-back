import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { TableReservation } from './reservation.model';
import { reservationUserRoles } from '../configs/reservation-user-roles';
import { ReservationUserRoles } from '../types/reservation-user-roles';
import { User } from 'src/users/models/user.model';
import { Seat } from 'src/seats/models/seat.model';
import { ReservationUserSeat } from 'src/seats/models/reservation-user-seat.model';

export interface TableReservationUserCreationArgs {
  reservationId: string;
  userId: string;
  role: ReservationUserRoles;
}

@Table({ tableName: 'table_reservation_users' })
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

  @BelongsToMany(() => Seat, () => ReservationUserSeat)
  seats: Seat[];
}
