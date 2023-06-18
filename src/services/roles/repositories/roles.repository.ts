import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Role, RoleCreationAttrs } from '../models/roles.model';

@Injectable()
export class RolesRepository extends AbstractRepository<
  Role,
  RoleCreationAttrs
> {
  protected readonly logger = new Logger(Role.name);

  constructor(
    @InjectModel(Role)
    private roleModel: typeof Role,
  ) {
    super(roleModel);
  }
}
