import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Role } from './roles.model';
import { AbstractModel } from 'src/libs/common';

export interface UserRolesCreationArgs {
  roleId: string;
  userId: string;
}

@Table({ tableName: 'user_global_roles', timestamps: false })
export class UserRoles extends AbstractModel<UserRoles> {
  @ForeignKey(() => Role)
  @Column({ type: DataType.STRING })
  roleId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  userId: string;
}
