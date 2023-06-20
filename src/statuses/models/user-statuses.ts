import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { AbstractModel } from 'src/libs/common';
import { Status } from './status.model';

export interface UserStatusesCreationArgs {
  statusId: string;
  userId: string;
}

@Table({ tableName: 'user_statuses', timestamps: false })
export class UserStatuses extends AbstractModel<
  UserStatuses,
  UserStatusesCreationArgs
> {
  @ForeignKey(() => Status)
  @Column({ type: DataType.STRING })
  statusId: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.STRING })
  userId: string;
}
