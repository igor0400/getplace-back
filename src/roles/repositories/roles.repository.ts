import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, RoleCreationArgs } from '../models/roles.model';

@Injectable()
export class RolesRepository extends AbstractRepository<
  Role,
  RoleCreationArgs
> {
  protected readonly logger = new Logger(Role.name);

  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {
    super(roleModel);
  }
}
