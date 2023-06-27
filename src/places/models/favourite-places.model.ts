import {
  Column,
  Table,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Place } from './place.model';
import { AbstractModel } from 'src/common';
import { User } from 'src/users/models/user.model';

export interface FavouritePlacesCreationArgs {
  placeId: string;
  userId: string;
}

@Table({ tableName: 'favourite_places', timestamps: false })
export class FavouritePlaces extends AbstractModel<
  FavouritePlaces,
  FavouritePlacesCreationArgs
> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
