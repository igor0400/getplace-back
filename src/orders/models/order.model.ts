import { Column, Table, DataType } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { orderTypes } from '../configs/order-types';
import { OrderTypes } from '../types/order-types';
import { orderStatuses } from '../configs/order-statuses';
import { OrderStatuses } from '../types/order-statuses';

export interface OrderCreationArgs {
  number: string;
  type: OrderTypes;
}

@Table({ tableName: 'orders' })
export class Order extends AbstractModel<Order, OrderCreationArgs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  number: string;

  @Column({
    type: DataType.ENUM(...orderTypes),
    allowNull: false,
  })
  type: OrderTypes;

  @Column({
    type: DataType.ENUM(...orderStatuses),
    defaultValue: 'CREATED',
  })
  status: OrderStatuses;

  @Column({
    type: DataType.STRING,
    defaultValue: '0',
  })
  totalPrice: string;
}
