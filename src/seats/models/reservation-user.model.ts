import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { User } from 'src/users/models/user.model';
import { SeatReservation } from './reservation.model';

export interface SeatReservationUserCreationArgs {
  reservationId: string;
  userId: string;
}

@NestTable({ tableName: 'seat_reservation_users' })
export class SeatReservationUser extends AbstractModel<
  SeatReservationUser,
  SeatReservationUserCreationArgs
> {
  @ForeignKey(() => SeatReservation)
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

  @BelongsTo(() => User)
  userData: User;
}
