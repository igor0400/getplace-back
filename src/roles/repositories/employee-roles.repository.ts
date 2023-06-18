import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  EmployeeRoles,
  EmployeeRolesCreationArgs,
} from '../models/employee-roles.model';

@Injectable()
export class EmployeeRolesRepository extends AbstractRepository<
  EmployeeRoles,
  EmployeeRolesCreationArgs
> {
  protected readonly logger = new Logger(EmployeeRoles.name);

  constructor(
    @InjectModel(EmployeeRoles)
    private employeeRolesModel: typeof EmployeeRoles,
  ) {
    super(employeeRolesModel);
  }
}
