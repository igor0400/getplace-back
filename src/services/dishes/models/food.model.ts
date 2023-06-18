import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Dish } from './dish.model';
import { AbstractModel } from 'src/libs/common';

export interface DishFoodCreationArgs {
  dishId: string;
  weight?: number;
  size?: number;
}

@Table({ tableName: 'dish_food_info' })
export class DishFood extends AbstractModel<DishFood, DishFoodCreationArgs> {
  @ForeignKey(() => Dish)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  dishId: string;

  @Column({
    type: DataType.INTEGER,
  })
  size: number;

  @Column({
    type: DataType.INTEGER,
  })
  weight: number;
}
