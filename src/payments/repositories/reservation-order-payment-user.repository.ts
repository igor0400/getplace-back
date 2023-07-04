import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ReservationOrderPaymentUser,
  ReservationOrderPaymentUserCreationArgs,
} from '../models/reservation-order-payment-user.model';

@Injectable()
export class ReservationOrderPaymentUserRepository extends AbstractRepository<
  ReservationOrderPaymentUser,
  ReservationOrderPaymentUserCreationArgs
> {
  protected readonly logger = new Logger(ReservationOrderPaymentUser.name);

  constructor(
    @InjectModel(ReservationOrderPaymentUser)
    private reservationOrderPaymentUserModel: typeof ReservationOrderPaymentUser,
  ) {
    super(reservationOrderPaymentUserModel);
  }
}
