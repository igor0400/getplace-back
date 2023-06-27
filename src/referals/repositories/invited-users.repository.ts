import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  ReferalInvitedUsers,
  ReferalInvitedUsersCreationArgs,
} from '../models/invited-users.model';

@Injectable()
export class ReferalsInvitedUsersRepository extends AbstractRepository<
  ReferalInvitedUsers,
  ReferalInvitedUsersCreationArgs
> {
  protected readonly logger = new Logger(ReferalInvitedUsers.name);

  constructor(
    @InjectModel(ReferalInvitedUsers)
    private invitedUsersModel: typeof ReferalInvitedUsers,
  ) {
    super(invitedUsersModel);
  }
}
