import { Column, Table, DataType, BelongsToMany } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { orderTypes } from '../configs/order-types';
import { OrderTypes } from '../types/order-types';
import { Status } from 'src/statuses/models/status.model';
import { OrderStatuses } from 'src/statuses/models/order-statuses.model';

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

  @BelongsToMany(() => Status, () => OrderStatuses)
  statuses: Status[];
}
