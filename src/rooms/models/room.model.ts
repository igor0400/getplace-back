import {
  Column,
  Table as NestTable,
  DataType,
  HasMany,
  ForeignKey,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Table } from '../../tables/models/table.model';
import { Place } from 'src/places/models/place.model';

export interface RoomCreationArgs {
  placeId: string;
  title: string;
  maxPositionsX: number;
  maxPositionsY: number;
}

@NestTable({ tableName: 'place_rooms' })
export class Room extends AbstractModel<Room, RoomCreationArgs> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxPositionsX: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  maxPositionsY: number;

  @HasMany(() => Table)
  tables: Table[];
}
