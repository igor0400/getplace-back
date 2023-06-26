import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Seat } from 'src/seats/models/seat.model';
import { TableReservationUser } from 'src/tables/models/reservation-user.model';

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
