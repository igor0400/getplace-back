import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { TableReservation } from 'src/tables/models/reservation.model';
import { Order } from './order.model';
import { ReservationOrderDish } from './reservation-order-dish.model';

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
}
