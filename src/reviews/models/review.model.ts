import { AbstractModel } from 'src/common';
import { Column, DataType, Table } from 'sequelize-typescript';

export interface ReviewCreationArgs {
  rating: number;
  text: string;
}

@Table({ tableName: 'reviews' })
export class Review extends AbstractModel<Review, ReviewCreationArgs> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  rating: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;
}
