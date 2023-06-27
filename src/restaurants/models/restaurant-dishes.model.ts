import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Dish } from '../../dishes/models/dish.model';
import { AbstractModel } from 'src/common';
import { Restaurant } from './restaurant.model';

export interface RestaurantDishesCreationArgs {
  restaurantId: string;
  dishId: string;
}

@Table({ tableName: 'restaurant_dishes', timestamps: false })
export class RestaurantDishes extends AbstractModel<
  RestaurantDishes,
  RestaurantDishesCreationArgs
> {
  @ForeignKey(() => Restaurant)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  restaurantId: string;

  @ForeignKey(() => Dish)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  dishId: string;
}
