import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  HasOne,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Order } from './order.model';
import { ReservationOrderDish } from './reservation-order-dish.model';
import { TableReservation } from 'src/reservations/models/table-reservation.model';
import { ReservationOrderPayment } from 'src/payments/models/reservation-order-payment.model';

export interface ReservationOrderCreationArgs {
  reservationId: string;
  orderId: string;
}

@Table({ tableName: 'reservation_orders' })
export class ReservationOrder extends AbstractModel<
  ReservationOrder,
  ReservationOrderCreationArgs
> {
  @ForeignKey(() => TableReservation)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reservationId: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderId: string;

  @HasMany(() => ReservationOrderDish)
  dishes: ReservationOrderDish[];

  @BelongsTo(() => Order)
  orderData: Order;

  @HasOne(() => ReservationOrderPayment)
  payment: ReservationOrderPayment;
}
