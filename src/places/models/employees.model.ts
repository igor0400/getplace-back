import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsToMany,
  BelongsTo,
} from 'sequelize-typescript';
import { Place } from './place.model';
import { AbstractModel } from 'src/libs/common';
import { Employee } from 'src/employees/models/employee.model';
import { Role } from 'src/roles/models/roles.model';
import { EmployeePlaceRoles } from 'src/roles/models/employee-place-roles.model';

export interface PlaceEmployeesCreationArgs {
  placeId: string;
  employeeId: string;
}

@Table({ tableName: 'place_employees' })
export class PlaceEmployees extends AbstractModel<
  PlaceEmployees,
  PlaceEmployeesCreationArgs
> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @ForeignKey(() => Employee)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  employeeId: string;

  @BelongsToMany(() => Role, () => EmployeePlaceRoles)
  employeeRoles: Role[];

  @BelongsTo(() => Employee)
  employeeData: Employee;

  @BelongsTo(() => Place)
  placeData: Place;
}
