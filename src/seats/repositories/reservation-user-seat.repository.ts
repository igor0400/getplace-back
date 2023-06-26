import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ReservationUserSeat,
  ReservationUserSeatCreationArgs,
} from '../models/reservation-user-seat.model';

@Injectable()
export class ReservationUserSeatRepository extends AbstractRepository<
  ReservationUserSeat,
  ReservationUserSeatCreationArgs
> {
  protected readonly logger = new Logger(ReservationUserSeat.name);

  constructor(
    @InjectModel(ReservationUserSeat)
    private reservationUserSeatModel: typeof ReservationUserSeat,
  ) {
    super(reservationUserSeatModel);
  }
}
