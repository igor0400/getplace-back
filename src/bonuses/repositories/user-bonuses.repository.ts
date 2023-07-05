import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  UserBonuses,
  UserBonusesCreationArgs,
} from '../models/user-bonuses.model';

@Injectable()
export class UserBonusesRepository extends AbstractRepository<
  UserBonuses,
  UserBonusesCreationArgs
> {
  protected readonly logger = new Logger(UserBonuses.name);

  constructor(
    @InjectModel(UserBonuses)
    private userBonusesModel: typeof UserBonuses,
  ) {
    super(userBonusesModel);
  }
}
