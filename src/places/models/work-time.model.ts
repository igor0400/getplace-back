import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { PlaceWork } from './work.model';
import { AbstractModel } from 'src/libs/common';

export interface WorkTimeCreationArgs {
  workId: string;
  from: string;
  till: string;
}

@Table({ tableName: 'work_time' })
export class WorkTime extends AbstractModel<WorkTime, WorkTimeCreationArgs> {
  @ForeignKey(() => PlaceWork)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  workId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  from: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  till: string;
}
