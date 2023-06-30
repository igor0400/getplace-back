import {
  Column,
  Table as NestTable,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Place } from 'src/places/models/place.model';
import { PlaceStat } from './place-stat.model';
import { User } from 'src/users/models/user.model';

export interface PlaceGuestsCreationArgs {
  placeId: string;
  placeStatId: string;
  guestId: string;
  startDate: Date;
  endDate: Date;
}

@NestTable({ tableName: 'place_guests' })
export class PlaceGuests extends AbstractModel<
  PlaceGuests,
  PlaceGuestsCreationArgs
> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @ForeignKey(() => PlaceStat)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeStatId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  guestId: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  startDate: Date;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  endDate: Date;

  @BelongsTo(() => User)
  guestData: User;
}
