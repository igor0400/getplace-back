import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Referals } from './referal.model';
import { AbstractModel } from 'src/libs/common';
import { User } from 'src/users/models/user.model';

export interface ReferalInvitersCreationArgs {
  referalId: string;
  userId: string;
}

@Table({ tableName: 'referal_inviters', timestamps: false })
export class ReferalInviters extends AbstractModel<
  ReferalInviters,
  ReferalInvitersCreationArgs
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
