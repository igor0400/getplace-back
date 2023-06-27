import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Seat, SeatCreationArgs } from '../models/seat.model';

@Injectable()
export class SeatRepository extends AbstractRepository<Seat, SeatCreationArgs> {
  protected readonly logger = new Logger(Seat.name);

  constructor(
    @InjectModel(Seat)
    private seatModel: typeof Seat,
  ) {
    super(seatModel);
  }
}
