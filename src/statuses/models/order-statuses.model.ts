import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Status } from './status.model';
import { Order } from 'src/orders/models/order.model';

export interface OrderStatusesCreationArgs {
  statusId: string;
  orderId: string;
}

@Table({ tableName: 'order_statuses', timestamps: false })
export class OrderStatuses extends AbstractModel<
  OrderStatuses,
  OrderStatusesCreationArgs
> {
  @ForeignKey(() => Status)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  statusId: string;

  @ForeignKey(() => Order)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  orderId: string;
}
