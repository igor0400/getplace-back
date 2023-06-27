import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Referals } from './referal.model';
import { AbstractModel } from 'src/common';
import { User } from 'src/users/models/user.model';

export interface ReferalInvitedUsersCreationArgs {
  referalId: string;
  userId: string;
}

@Table({ tableName: 'referal_invited_users', timestamps: false })
export class ReferalInvitedUsers extends AbstractModel<
  ReferalInvitedUsers,
  ReferalInvitedUsersCreationArgs
> {
  @ForeignKey(() => Referals)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  referalId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;
}
