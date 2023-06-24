import {
  Column,
  Table,
  DataType,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Seat } from './seat.model';
import { SeatReservationUser } from './reservation-user.model';

export interface SeatReservationCreationArgs {
  seatId: string;
  startDate: string;
  endDate: string;
}

@Table({ tableName: 'seat_reservations' })
export class SeatReservation extends AbstractModel<
  SeatReservation,
  SeatReservationCreationArgs
> {
  @ForeignKey(() => Seat)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  seatId: string;

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

  @HasOne(() => SeatReservationUser)
  user: SeatReservationUser;
}
