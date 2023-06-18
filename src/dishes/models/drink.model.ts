import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Dish } from './dish.model';
import { AbstractModel } from 'src/libs/common';

export interface DishDrinkCreationArgs {
  dishId: string;
  volume?: number;
}

@Table({ tableName: 'dish_drink_info' })
export class DishDrink extends AbstractModel<DishDrink, DishDrinkCreationArgs> {
  @ForeignKey(() => Dish)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  dishId: string;

  @Column({
    type: DataType.INTEGER,
  })
  volume: number;
}
