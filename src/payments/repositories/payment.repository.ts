import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Payment, PaymentCreationArgs } from '../models/payment.model';
import { uid } from 'uid';

@Injectable()
export class PaymentRepository extends AbstractRepository<
  Payment,
  PaymentCreationArgs
> {
  protected readonly logger = new Logger(Payment.name);

  constructor(
    @InjectModel(Payment)
    private paymentModel: typeof Payment,
  ) {
    super(paymentModel);
  }

  async customCreate(dto: Omit<Omit<Payment, 'id'>, 'shortId'>) {
    const document = await this.paymentModel.create({
      ...dto,
      shortId: uid(20).toUpperCase(),
    });

    return document;
  }
}
