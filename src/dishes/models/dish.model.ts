import {
  Column,
  Table,
  DataType,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { DishImages } from './images.model';
import { DishTypes } from '../types/dish-types';
import { DishFood } from './food.model';
import { DishDrink } from './drink.model';
import { AbstractModel } from 'src/libs/common';
import { dishTypes } from '../configs/dish-types';
import { File } from 'src/files/models/file.model';

export interface DishCreationArgs {
  title: string;
  description: string;
  catigory: string;
  type: DishTypes;
  cost: number;
  position: number;
  isAvailable: boolean;
}

@Table({ tableName: 'dishes' })
export class Dish extends AbstractModel<Dish, DishCreationArgs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  catigory: string;

  @Column({
    type: DataType.ENUM(...dishTypes),
    allowNull: false,
  })
  type: DishTypes;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  cost: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  position: number;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  isAvailable: boolean;

  @HasOne(() => DishFood)
  foodInfo: DishFood;

  @HasOne(() => DishDrink)
  drinkInfo: DishDrink;

  @BelongsToMany(() => File, () => DishImages)
  images: File[];
}
