import {
  Column,
  Table,
  DataType,
  ForeignKey,
  HasOne,
  BelongsToMany,
  HasMany,
} from 'sequelize-typescript';
import { PlaceWork } from './work.model';
import { PlaceAddress } from './address.model';
import { PlaceImages } from './images.model';
import { placeTypes } from '../configs/place-types';
import { PlaceTypes } from '../types/place-types';
import { PlaceEmployees } from './employees.model';
import { AbstractModel } from 'src/libs/common';
import { Employee } from 'src/services/employees/models/employee.model';
import { Restaurant } from 'src/services/restaurants/models/restaurant.model';
import { File } from 'src/services/files/models/file.model';

export interface PlaceCreationArgs {
  employeeId: string;
  title: string;
  description: string;
  type: PlaceTypes;
  price: number;
}

///// НАДО СДЕЛАТЬ!!!!!!!!!!!!!
// ОТЗЫВЫ
// СТОЛЫ
// АКЦИИ
// ПРОДВИЖЕНИЕ
// сделать в модели заведения общее кол-во того что будет отрисовано

@Table({ tableName: 'places' })
export class Place extends AbstractModel<Place, PlaceCreationArgs> {
  @ForeignKey(() => Employee)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  employeeId: string;

  @Column({
    type: DataType.ENUM(...placeTypes),
    allowNull: false,
  })
  type: PlaceTypes;

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
  category: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  accepted: boolean;

  @Column({
    type: DataType.INTEGER,
  })
  price: number;

  @HasOne(() => PlaceWork)
  work: PlaceWork;

  @HasOne(() => PlaceAddress)
  address: PlaceAddress;

  @HasOne(() => Restaurant)
  restaurantInfo: Restaurant;

  @BelongsToMany(() => File, () => PlaceImages)
  images: File[];

  @HasMany(() => PlaceEmployees)
  employees: PlaceEmployees[];
}
