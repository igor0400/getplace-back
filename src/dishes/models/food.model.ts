import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Dish } from './dish.model';
import { AbstractModel } from 'src/common';

export interface DishFoodCreationArgs {
  dishId: string;
  weight?: string;
  size?: string;
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
    type: DataType.STRING,
  })
  size: string;

  @Column({
    type: DataType.STRING,
  })
  weight: string;
}
