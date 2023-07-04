import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { User } from 'src/users/models/user.model';
import { Dish } from 'src/dishes/models/dish.model';
import { ReservationOrder } from './reservation-order.model';
import { TableReservationUser } from 'src/reservations/model/table-reservation-user.model';

export interface ReservationOrderDishCreationArgs {
  reservationOrderId: string;
  reservationUserId: string;
  userId: string;
  dishId: string;
  count?: number;
}

@Table({ tableName: 'reservation_order_dishes' })
export class ReservationOrderDish extends AbstractModel<
  ReservationOrderDish,
  ReservationOrderDishCreationArgs
> {
  @ForeignKey(() => ReservationOrder)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reservationOrderId: string;

  @ForeignKey(() => TableReservationUser)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  reservationUserId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Dish)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  dishId: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 1,
  })
  count: number;

  @BelongsTo(() => Dish)
  dishData: Dish;

  @BelongsTo(() => TableReservationUser)
  reservationUserData: TableReservationUser;
}
