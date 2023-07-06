import {
  Column,
  Table as NestTable,
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
import { AbstractModel } from 'src/common';
import { Employee } from 'src/employees/models/employee.model';
import { Restaurant } from 'src/restaurants/models/restaurant.model';
import { File } from 'src/files/models/file.model';
import { Room } from 'src/rooms/models/room.model';
import { Boost } from 'src/boosts/models/boost.model';
import { PlaceBoosts } from 'src/boosts/models/place-boosts.model';
import { Table } from 'src/tables/models/table.model';
import { FreeTable } from 'src/tables/models/free-table.model';
import { Review } from 'src/reviews/models/review.model';
import { PlaceReview } from 'src/reviews/models/place-review.model';

export interface PlaceCreationArgs {
  employeeId: string;
  title: string;
  description: string;
  type: PlaceTypes;
  price?: string;
  color?: string;
}

@NestTable({ tableName: 'places' })
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
  isAccepted: boolean;

  @Column({
    type: DataType.STRING,
  })
  price: string;

  @Column({
    type: DataType.STRING,
  })
  color: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  freeTables: number;

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

  @HasMany(() => Room)
  rooms: Room[];

  @BelongsToMany(() => Boost, () => PlaceBoosts)
  boosts: Boost[];

  @BelongsToMany(() => Table, () => FreeTable)
  freeTablesList: Table[];

  @BelongsToMany(() => Review, () => PlaceReview)
  reviews: Review[];
}
