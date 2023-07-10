import { AbstractModel } from 'src/common';
import {
  Column,
  Table,
  DataType,
  HasMany,
  BelongsToMany,
} from 'sequelize-typescript';
import { Role } from 'src/roles/models/roles.model';
import { EmployeeRoles } from 'src/roles/models/employee-roles.model';
import { PlaceEmployees } from 'src/places/models/employees.model';
import { EmployeeSession } from 'src/sessions/models/employee-session.model';

export interface EmployeeCreationArgs {
  password: string;
  email: string;
  phone: string;
  iin?: string;
  name?: string;
  birthday?: string;
}

@Table({ tableName: 'employees' })
export class Employee extends AbstractModel<Employee, EmployeeCreationArgs> {
  @Column({
    type: DataType.STRING,
  })
  iin: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  emailVerify: boolean;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  birthday: string;

  @HasMany(() => EmployeeSession)
  sessions: EmployeeSession[];

  @BelongsToMany(() => Role, () => EmployeeRoles)
  roles: Role[];

  @HasMany(() => PlaceEmployees)
  places: PlaceEmployees[];
}
