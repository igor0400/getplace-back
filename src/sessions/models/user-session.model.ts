import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { AbstractModel } from 'src/common';

export interface UserSessionCreationArgs {
  userId: string;
  userIp: string;
  userAgent: string;
  expires: Date;
}

@Table({ tableName: 'user_sessions' })
export class UserSession extends AbstractModel<
  UserSession,
  UserSessionCreationArgs
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userIp: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userAgent: string;

  @Column({ type: DataType.DATE, allowNull: false })
  expires: Date;

  @BelongsTo(() => User)
  user: User;
}
