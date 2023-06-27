import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Employee } from '../../employees/models/employee.model';
import { Role } from './roles.model';
import { AbstractModel } from 'src/common';

export interface EmployeeRolesCreationArgs {
  roleId: string;
  employeeId: string;
}

@Table({ tableName: 'employee_global_roles', timestamps: false })
export class EmployeeRoles extends AbstractModel<EmployeeRoles> {
  @ForeignKey(() => Role)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  roleId: string;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  employeeId: string;
}
