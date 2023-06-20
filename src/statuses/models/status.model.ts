import { AbstractModel } from 'src/libs/common';
import { Column, DataType, Table } from 'sequelize-typescript';

export interface StatusCreationArgs {
  value: string;
  description: string;
}

@Table({ tableName: 'statuses' })
export class Status extends AbstractModel<Status, StatusCreationArgs> {
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  value: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;
}
