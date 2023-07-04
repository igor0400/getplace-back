import { Injectable } from '@nestjs/common';
import { PaymentRepository } from './repositories/payment.repository';
import { uid } from 'uid';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { ReservationOrderPaymentUserRepository } from './repositories/reservation-order-payment-user.repository';
import { ReservationOrderPaymentRepository } from './repositories/reservation-order-payment.repository';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentRepository: PaymentRepository,
    private readonly reservationOrderPaymentRepository: ReservationOrderPaymentRepository,
    private readonly reservationOrderPaymentUserRepository: ReservationOrderPaymentUserRepository,
  ) {}

  async createPayment(dto: CreatePaymentDto) {
    const payment = await this.paymentRepository.create({
      ...dto,
      shortId: uid(20).toUpperCase(),
    });

    return payment;
  }

  // сделать создание всех моделей и подлючить их к оплате заказов
}
