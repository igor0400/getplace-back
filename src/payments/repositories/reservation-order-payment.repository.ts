import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ReservationOrderPayment,
  ReservationOrderPaymentCreationArgs,
} from '../models/reservation-order-payment.model';

@Injectable()
export class ReservationOrderPaymentRepository extends AbstractRepository<
  ReservationOrderPayment,
  ReservationOrderPaymentCreationArgs
> {
  protected readonly logger = new Logger(ReservationOrderPayment.name);

  constructor(
    @InjectModel(ReservationOrderPayment)
    private reservationOrderPaymentModel: typeof ReservationOrderPayment,
  ) {
    super(reservationOrderPaymentModel);
  }
}
