import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { User } from 'src/users/models/user.model';

export interface UserBonusesCreationArgs {
  userId: string;
}

@Table({ tableName: 'user_bonuses' })
export class UserBonuses extends AbstractModel<
  UserBonuses,
  UserBonusesCreationArgs
> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @Column({
    type: DataType.STRING,
    defaultValue: '0',
  })
  internalBalance: string;
}
