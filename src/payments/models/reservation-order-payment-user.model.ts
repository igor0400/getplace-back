import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { ReservationOrderPayment } from './reservation-order-payment.model';
import { Payment } from './payment.model';
import { User } from 'src/users/models/user.model';

export interface ReservationOrderPaymentUserCreationArgs {
  reservationOrderPaymentId: string;
  paymentId: string;
}

@Table({ tableName: 'reservation_order_payment_users' })
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
}
