import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentRepository } from './repositories/payment.repository';
import { DatabaseModule } from 'src/common';
import { Payment } from './models/payment.model';

@Module({
  imports: [DatabaseModule.forFeature([Payment])],
  providers: [PaymentsService, PaymentRepository],
})
export class PaymentsModule {}
