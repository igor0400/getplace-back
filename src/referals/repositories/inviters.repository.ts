import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ReferalInviters,
  ReferalInvitersCreationArgs,
} from '../models/inviters.model';

@Injectable()
export class ReferalsInvitersRepository extends AbstractRepository<
  ReferalInviters,
  ReferalInvitersCreationArgs
> {
  protected readonly logger = new Logger(ReferalInviters.name);

  constructor(
    @InjectModel(ReferalInviters)
    private referalInvitersModel: typeof ReferalInviters,
  ) {
    super(referalInvitersModel);
  }
}
