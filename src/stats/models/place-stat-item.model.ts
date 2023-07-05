import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { PlaceStat } from './place-stat.model';
import { Sequelize } from 'sequelize';

export interface PlaceStatItemCreationArgs {
  placeStatId: string;
  title: string;
  dayCount?: number;
  weekCount?: number;
  monthCount?: number;
  yearCount?: number;
  allTimeCount?: number;
}

@NestTable({ tableName: 'place_stat_items' })
export class PlaceStatItem extends AbstractModel<
  PlaceStatItem,
  PlaceStatItemCreationArgs
> {
  @ForeignKey(() => PlaceStat)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeStatId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  dayCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  weekCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  monthCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  yearCount: number;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  allTimeCount: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW(),
  })
  daysLastClearDate: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW(),
  })
  weeksLastClearDate: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW(),
  })
  monthsLastClearDate: Date;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW(),
  })
  yearsLastClearDate: Date;
}
