import { Module, forwardRef } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderRepository } from './repositories/order.repository';
import { ReservationOrderRepository } from './repositories/reservation-order.repository';
import { DatabaseModule } from 'src/libs/common';
import { Order } from './models/order.model';
import { ReservationOrder } from './models/reservation-order.model';
import { ReservationOrderDish } from './models/reservation-order-dish.model';
import { ReservationOrderDishRepository } from './repositories/reservation-order-dish.repository';
import { TablesModule } from 'src/tables/tables.module';
import { DishesModule } from 'src/dishes/dishes.module';
import { OrdersController } from './orders.controller';

@Module({
  imports: [
    DatabaseModule.forFeature([Order, ReservationOrder, ReservationOrderDish]),
    forwardRef(() => TablesModule),
    DishesModule,
  ],
  providers: [
    OrdersService,
    OrderRepository,
    ReservationOrderRepository,
    ReservationOrderDishRepository,
  ],
  exports: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
