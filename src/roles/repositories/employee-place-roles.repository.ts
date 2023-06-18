import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  EmployeePlaceRoles,
  EmployeePlaceRolesCreationArgs,
} from '../models/employee-place-roles.model';

@Injectable()
export class EmployeePlaceRolesRepository extends AbstractRepository<
  EmployeePlaceRoles,
  EmployeePlaceRolesCreationArgs
> {
  protected readonly logger = new Logger(EmployeePlaceRoles.name);

  constructor(
    @InjectModel(EmployeePlaceRoles)
    private employeePlaceRolesModel: typeof EmployeePlaceRoles,
  ) {
    super(employeePlaceRolesModel);
  }
}
