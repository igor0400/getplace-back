import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  EmployeeSession,
  EmployeeSessionCreationArgs,
} from '../models/employee-session.model';

@Injectable()
export class EmployeeSessionRepository extends AbstractRepository<
  EmployeeSession,
  EmployeeSessionCreationArgs
> {
  protected readonly logger = new Logger(EmployeeSession.name);

  constructor(
    @InjectModel(EmployeeSession)
    private employeeSessionModel: typeof EmployeeSession,
  ) {
    super(employeeSessionModel);
  }
}
