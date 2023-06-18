import { AbstractRepository } from 'src/libs/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Employee, EmployeeCreationArgs } from '../models/employee.model';

@Injectable()
export class EmployeesRepository extends AbstractRepository<
  Employee,
  EmployeeCreationArgs
> {
  protected readonly logger = new Logger(Employee.name);

  constructor(
    @InjectModel(Employee)
    private employeeModel: typeof Employee,
  ) {
    super(employeeModel);
  }
}
