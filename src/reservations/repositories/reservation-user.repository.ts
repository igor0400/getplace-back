import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  TableReservationUser,
  TableReservationUserCreationArgs,
} from '../models/table-reservation-user.model';

@Injectable()
export class TableReservationUserRepository extends AbstractRepository<
  TableReservationUser,
  TableReservationUserCreationArgs
> {
  protected readonly logger = new Logger(TableReservationUser.name);

  constructor(
    @InjectModel(TableReservationUser)
    private reservationUserModel: typeof TableReservationUser,
  ) {
    super(reservationUserModel);
  }
}
