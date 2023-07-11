import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { TableReservationUser } from 'src/reservations/models/table-reservation-user.model';
import { Seat } from 'src/seats/models/seat.model';

export interface ReservationUserSeatCreationArgs {
  reservationUserId: string;
  seatId: string;
}

@Table({ tableName: 'reservation_user_seats', timestamps: false })
export class ReservationUserSeat extends AbstractModel<
  ReservationUserSeat,
  ReservationUserSeatCreationArgs
> {
  @ForeignKey(() => TableReservationUser)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reservationUserId: string;

  @ForeignKey(() => Seat)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  seatId: string;
}
