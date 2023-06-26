import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ReservationOrderDish,
  ReservationOrderDishCreationArgs,
} from '../models/reservation-order-dish.model';

@Injectable()
export class ReservationOrderDishRepository extends AbstractRepository<
  ReservationOrderDish,
  ReservationOrderDishCreationArgs
> {
  protected readonly logger = new Logger(ReservationOrderDish.name);

  constructor(
    @InjectModel(ReservationOrderDish)
    private reservationOrderDishModel: typeof ReservationOrderDish,
  ) {
    super(reservationOrderDishModel);
  }
}
