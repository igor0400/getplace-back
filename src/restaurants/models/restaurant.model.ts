import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Dish } from 'src/dishes/models/dish.model';
import { RestaurantDishes } from 'src/restaurants/models/restaurant-dishes.model';
import { Place } from 'src/places/models/place.model';

export interface RestaurantCreationArgs {
  placeId: string;
}

@Table({ tableName: 'restaurants' })
export class Restaurant extends AbstractModel<
  Restaurant,
  RestaurantCreationArgs
> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @BelongsToMany(() => Dish, () => RestaurantDishes)
  menu: Dish[];
}
