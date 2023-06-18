import {
  Column,
  Model,
  Table,
  DataType,
  ForeignKey,
  HasOne,
} from 'sequelize-typescript';
import { Place } from './place.model';
import { WorkDays } from './work-days.model';
import { WorkTime } from './work-time.model';
import { AbstractModel } from 'src/libs/common';

export interface PlaceWorkCreationArgs {
  placeId: string;
}

@Table({ tableName: 'place_work', timestamps: false })
export class PlaceWork extends AbstractModel<PlaceWork, PlaceWorkCreationArgs> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @HasOne(() => WorkDays)
  days: WorkDays;

  @HasOne(() => WorkTime)
  time: WorkTime;
}
