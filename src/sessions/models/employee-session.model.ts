import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Employee } from '../../employees/models/employee.model';
import { AbstractModel } from 'src/common';

export interface EmployeeSessionCreationArgs {
  employeeId: string;
  employeeIp: string;
  userAgent: string;
  expires: Date;
}

@Table({ tableName: 'employee_sessions' })
export class EmployeeSession extends AbstractModel<
  EmployeeSession,
  EmployeeSessionCreationArgs
> {
  @ForeignKey(() => Employee)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  employeeId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  employeeIp: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userAgent: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expires: Date;

  @BelongsTo(() => Employee)
  employee: Employee;
}
