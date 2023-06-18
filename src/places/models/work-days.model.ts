import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { PlaceWork } from './work.model';
import { Days } from '../types/days';
import { days } from '../configs/days';
import { AbstractModel } from 'src/libs/common';

export interface WorkDaysCreationArgs {
  workId: string;
  from: Days;
  till: Days;
}

@Table({ tableName: 'work_days' })
export class WorkDays extends AbstractModel<WorkDays, WorkDaysCreationArgs> {
  @ForeignKey(() => PlaceWork)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  workId: string;

  @Column({
    type: DataType.ENUM(...days),
    allowNull: false,
  })
  from: Days;

  @Column({
    type: DataType.ENUM(...days),
    allowNull: false,
  })
  till: Days;
}
