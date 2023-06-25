import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  TableReservationInvite,
  TableReservationInviteCreationArgs,
} from '../models/reservation-invite.model';

@Injectable()
export class TableReservationInviteRepository extends AbstractRepository<
  TableReservationInvite,
  TableReservationInviteCreationArgs
> {
  protected readonly logger = new Logger(TableReservationInvite.name);

  constructor(
    @InjectModel(TableReservationInvite)
    private reservationInviteModel: typeof TableReservationInvite,
  ) {
    super(reservationInviteModel);
  }
}
