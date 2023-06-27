import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  OrderStatuses,
  OrderStatusesCreationArgs,
} from '../models/order-statuses.model';

@Injectable()
export class OrderStatusesRepository extends AbstractRepository<
  OrderStatuses,
  OrderStatusesCreationArgs
> {
  protected readonly logger = new Logger(OrderStatuses.name);

  constructor(
    @InjectModel(OrderStatuses)
    private orderStatusesModel: typeof OrderStatuses,
  ) {
    super(orderStatusesModel);
  }
}
