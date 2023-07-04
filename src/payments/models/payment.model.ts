import {
  Column,
  Table,
  DataType,
  ForeignKey,
  HasOne,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';

export interface PaymentCreationArgs {
  shortId: string;
  amount: string;
  currency: string;
}

@Table({ tableName: 'payments' })
export class Payment extends AbstractModel<Payment, PaymentCreationArgs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  shortId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  amount: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;
}
