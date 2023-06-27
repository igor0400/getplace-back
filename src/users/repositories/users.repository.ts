import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserCreationArgs } from '../models/user.model';

@Injectable()
export class UsersRepository extends AbstractRepository<
  User,
  UserCreationArgs
> {
  protected readonly logger = new Logger(User.name);

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {
    super(userModel);
  }
}
