import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/libs/common';
import { Dish } from 'src/services/dishes/models/dish.model';
import { RestaurantDishes } from 'src/services/dishes/models/restaurant-dishes.model';
import { Place } from 'src/services/places/models/place.model';

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
  dishes: Dish[];
}
