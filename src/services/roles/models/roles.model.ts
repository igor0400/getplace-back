import { AbstractModel } from 'src/libs/common';
import { Column, DataType, Table } from 'sequelize-typescript';

export interface RoleCreationAttrs {
  value: string;
  description: string;
}

@Table({ tableName: 'roles' })
export class Role extends AbstractModel<Role, RoleCreationAttrs> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;
}
