import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRepository } from './repositories/order.repository';
import { ReservationOrderRepository } from './repositories/reservation-order.repository';
import { DatabaseModule } from 'src/common';
import { Order } from './models/order.model';
import { ReservationOrder } from './models/reservation-order.model';
import { ReservationOrderDish } from './models/reservation-order-dish.model';
import { ReservationOrderDishRepository } from './repositories/reservation-order-dish.repository';
import { TablesModule } from 'src/tables/tables.module';
import { DishesModule } from 'src/dishes/dishes.module';
import { OrdersController } from './orders.controller';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { PaymentsModule } from 'src/payments/payments.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Order, ReservationOrder, ReservationOrderDish]),
    forwardRef(() => TablesModule),
    forwardRef(() => DishesModule),
    forwardRef(() => ReservationsModule),
    forwardRef(() => PaymentsModule),
  ],
  providers: [
    OrdersService,
    OrderRepository,
    ReservationOrderRepository,
    ReservationOrderDishRepository,
  ],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
