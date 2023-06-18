import { AbstractModel } from 'src/libs/common';
import { Column, Table, DataType } from 'sequelize-typescript';

export interface FileCreationArgs {
  name: string;
  src: string;
  size: number;
}

@Table({ tableName: 'files' })
export class File extends AbstractModel<File, FileCreationArgs> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  src: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  size: number;
}
