import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ReservationUser,
  ReservationUserCreationArgs,
} from '../models/reservation-user.model';

@Injectable()
export class ReservationUserRepository extends AbstractRepository<
  ReservationUser,
  ReservationUserCreationArgs
> {
  protected readonly logger = new Logger(ReservationUser.name);

  constructor(
    @InjectModel(ReservationUser)
    private reservationUserModel: typeof ReservationUser,
  ) {
    super(reservationUserModel);
  }
}
