import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Boost, BoostCreationArgs } from '../models/boost.model';

@Injectable()
export class BoostRepository extends AbstractRepository<
  Boost,
  BoostCreationArgs
> {
  protected readonly logger = new Logger(Boost.name);

  constructor(
    @InjectModel(Boost)
    private boostModel: typeof Boost,
  ) {
    super(boostModel);
  }
}
