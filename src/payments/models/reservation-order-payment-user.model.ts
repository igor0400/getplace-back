import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { ReservationOrderPayment } from './reservation-order-payment.model';
import { Payment } from './payment.model';
import { User } from 'src/users/models/user.model';
import { Place } from 'src/places/models/place.model';

export interface ReservationOrderPaymentUserCreationArgs {
  reservationOrderPaymentId: string;
  placeId: string;
  paymentId: string;
  userId: string;
}

@Table({ tableName: 'reservation_order_payment_users', timestamps: false })
export class ReservationOrderPaymentUser extends AbstractModel<
  ReservationOrderPaymentUser,
  ReservationOrderPaymentUserCreationArgs
> {
  @ForeignKey(() => ReservationOrderPayment)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reservationOrderPaymentId: string;

  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @ForeignKey(() => Payment)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  paymentId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => Payment)
  paymentData: Payment;
}
