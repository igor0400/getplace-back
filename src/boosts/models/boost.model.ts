import { AbstractModel } from 'src/common';
import { Column, DataType, Table } from 'sequelize-typescript';

export interface BoostCreationArgs {
  value: string;
  description: string;
}

@Table({ tableName: 'boosts' })
export class Boost extends AbstractModel<Boost, BoostCreationArgs> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  value: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;
}
