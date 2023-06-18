import {
  Column,
  Table,
  DataType,
  BelongsToMany,
  ForeignKey,
} from 'sequelize-typescript';
import { ReferalInviters } from './inviters.model';
import { ReferalInvitedUsers } from './invited-users.model';
import { AbstractModel } from 'src/libs/common';
import { User } from 'src/services/users/models/user.model';

export interface ReferalsCreationArgs {
  userId: string;
}

@Table({ tableName: 'referals' })
export class Referals extends AbstractModel<Referals, ReferalsCreationArgs> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  referalProcent: number;

  @BelongsToMany(() => User, () => ReferalInviters)
  inviter: User[];

  @BelongsToMany(() => User, () => ReferalInvitedUsers)
  invitedUsers: User[];
}
