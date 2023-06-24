import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  TableReservation,
  TableReservationCreationArgs,
} from '../models/reservation.model';

@Injectable()
export class TableReservationRepository extends AbstractRepository<
  TableReservation,
  TableReservationCreationArgs
> {
  protected readonly logger = new Logger(TableReservation.name);

  constructor(
    @InjectModel(TableReservation)
    private tableReservationModel: typeof TableReservation,
  ) {
    super(tableReservationModel);
  }
}
