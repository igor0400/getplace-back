import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
  HasMany,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Place } from 'src/places/models/place.model';
import { PlaceStatItem } from './place-stat-item.model';
import { PlaceGuests } from './place-guests.model';

export interface PlaceStatCreationArgs {
  placeId: string;
}

@NestTable({ tableName: 'place_stats' })
export class PlaceStat extends AbstractModel<PlaceStat, PlaceStatCreationArgs> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @HasMany(() => PlaceStatItem)
  items: PlaceStatItem[];

  @HasMany(() => PlaceGuests)
  guests: PlaceGuests[];

  @BelongsTo(() => Place)
  placeData: Place;
}
