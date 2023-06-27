import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { Role } from './roles.model';
import { AbstractModel } from 'src/common';
import { PlaceEmployees } from 'src/places/models/employees.model';

export interface EmployeePlaceRolesCreationArgs {
  placeEmployeeId: string;
  roleId: string;
}

@Table({ tableName: 'employee_place_roles', timestamps: false })
export class EmployeePlaceRoles extends AbstractModel<EmployeePlaceRoles> {
  @ForeignKey(() => PlaceEmployees)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeEmployeeId: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  roleId: string;
}
