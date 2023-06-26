import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Order, OrderCreationArgs } from '../models/order.model';

@Injectable()
export class OrderRepository extends AbstractRepository<
  Order,
  OrderCreationArgs
> {
  protected readonly logger = new Logger(Order.name);

  constructor(
    @InjectModel(Order)
    private orderModel: typeof Order,
  ) {
    super(orderModel);
  }
}
