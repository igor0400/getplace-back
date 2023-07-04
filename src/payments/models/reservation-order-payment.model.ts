import {
  Column,
  Table,
  DataType,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { ReservationOrder } from 'src/orders/models/reservation-order.model';
import { ReservationOrderPaymentUser } from './reservation-order-payment-user.model';
import { ReservationOrderPaymentTypes } from '../types/reservation-order-payment-types';
import { reservationOrderPaymentTypes } from '../configs/reservation-order-payment-types';

export interface ReservationOrderPaymentCreationArgs {
  paymentId: string;
  reservationOrderId: string;
  type?: ReservationOrderPaymentTypes;
}

// сделать миграции всех моделей в payments

@Table({ tableName: 'reservation_order_payments' })
export class ReservationOrderPayment extends AbstractModel<
  ReservationOrderPayment,
  ReservationOrderPaymentCreationArgs
> {
  @ForeignKey(() => ReservationOrder)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reservationOrderId: string;

  @Column({
    type: DataType.ENUM(...reservationOrderPaymentTypes),
    defaultValue: 'oneForAll',
  })
  type: ReservationOrderPaymentTypes;

  @HasMany(() => ReservationOrderPaymentUser)
  users: ReservationOrderPaymentUser[];
}
