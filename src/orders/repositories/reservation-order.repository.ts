import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ReservationOrder,
  ReservationOrderCreationArgs,
} from '../models/reservation-order.model';

@Injectable()
export class ReservationOrderRepository extends AbstractRepository<
  ReservationOrder,
  ReservationOrderCreationArgs
> {
  protected readonly logger = new Logger(ReservationOrder.name);

  constructor(
    @InjectModel(ReservationOrder)
    private reservationOrderModel: typeof ReservationOrder,
  ) {
    super(reservationOrderModel);
  }
}
