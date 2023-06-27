import { AbstractModel } from 'src/common';
import { Column, DataType, Table } from 'sequelize-typescript';

export interface RoleCreationArgs {
  value: string;
  description: string;
}

@Table({ tableName: 'roles' })
export class Role extends AbstractModel<Role, RoleCreationArgs> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;
}
