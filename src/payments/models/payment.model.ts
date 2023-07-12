import { Column, Table, DataType } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';

export interface PaymentCreationArgs {
  shortId: string;
  initialAmount: string;
  discountProcent: string;
  discountAmount: string;
  totalAmount: string;
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
  initialAmount: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  discountProcent: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  discountAmount: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  totalAmount: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  currency: string;
}
