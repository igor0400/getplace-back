import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Referals, ReferalsCreationArgs } from '../models/referal.model';

@Injectable()
export class ReferalsRepository extends AbstractRepository<
  Referals,
  ReferalsCreationArgs
> {
  protected readonly logger = new Logger(Referals.name);

  constructor(
    @InjectModel(Referals)
    private referalsModel: typeof Referals,
  ) {
    super(referalsModel);
  }
}
