import { AbstractModel } from 'src/common';
import { Column, DataType, Table } from 'sequelize-typescript';

export interface ReviewCreationArgs {
  totalRating: number;
  ratingKitchen: number;
  ratingAtmosphere: number;
  ratingService: number;
  text: string;
}

@Table({ tableName: 'reviews' })
export class Review extends AbstractModel<Review, ReviewCreationArgs> {
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  totalRating: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ratingKitchen: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ratingAtmosphere: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  ratingService: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  text: string;
}
