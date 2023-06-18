import {
  Column,
  Table,
  DataType,
  HasMany,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Referals } from 'src/referals/models/referal.model';
import { Role } from 'src/roles/models/roles.model';
import { UserRoles } from 'src/roles/models/user-roles.model';
import { UserSession } from 'src/sessions/models/user-session.model';

export interface UserCreationArgs {
  password: string;
  email: string;
  status: 'default' | 'cybersportsman' | 'premium' | 'celebrity';
  iin: string;
  phone: string;
  referalCode?: string;
}

@Table({ tableName: 'users' })
export class User extends AbstractModel<User, UserCreationArgs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  iin: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  email: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  emailVerify: boolean;

  @Column({
    type: DataType.ENUM('default', 'cybersportsman', 'premium', 'celebrity'),
    allowNull: false,
    defaultValue: 'default',
  })
  status: 'default' | 'cybersportsman' | 'premium' | 'celebrity';

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  birthday: string;

  @Column({
    type: DataType.STRING,
  })
  referalCode: string;

  @HasOne(() => Referals)
  referals: Referals;

  @HasMany(() => UserSession)
  sessions: UserSession[];

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];
}
