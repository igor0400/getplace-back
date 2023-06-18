import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  UserSession,
  UserSessionCreationArgs,
} from '../models/user-session.model';

@Injectable()
export class UserSessionRepository extends AbstractRepository<
  UserSession,
  UserSessionCreationArgs
> {
  protected readonly logger = new Logger(UserSession.name);

  constructor(
    @InjectModel(UserSession)
    private userSessionModel: typeof UserSession,
  ) {
    super(userSessionModel);
  }
}
