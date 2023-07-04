import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentRepository } from './repositories/payment.repository';
import { DatabaseModule } from 'src/common';
import { Payment } from './models/payment.model';
import { ReservationOrderPayment } from './models/reservation-order-payment.model';
import { ReservationOrderPaymentUser } from './models/reservation-order-payment-user.model';
import { ReservationOrderPaymentRepository } from './repositories/reservation-order-payment.repository';
import { ReservationOrderPaymentUserRepository } from './repositories/reservation-order-payment-user.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([
      Payment,
      ReservationOrderPayment,
      ReservationOrderPaymentUser,
    ]),
  ],
  providers: [
    PaymentsService,
    PaymentRepository,
    ReservationOrderPaymentRepository,
    ReservationOrderPaymentUserRepository,
  ],
})
export class PaymentsModule {}
