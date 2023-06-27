import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  UserStatuses,
  UserStatusesCreationArgs,
} from '../models/user-statuses.model';

@Injectable()
export class UserStatusesRepository extends AbstractRepository<
  UserStatuses,
  UserStatusesCreationArgs
> {
  protected readonly logger = new Logger(UserStatuses.name);

  constructor(
    @InjectModel(UserStatuses)
    private userStatusesModel: typeof UserStatuses,
  ) {
    super(userStatusesModel);
  }
}
