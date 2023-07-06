import { AbstractModel } from 'src/common';
import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Place } from 'src/places/models/place.model';
import { User } from 'src/users/models/user.model';

export interface UserFavouritePlaceCreationArgs {
  placeId: string;
  userId: string;
}

@Table({ tableName: 'user_favourite_places', timestamps: false })
export class UserFavouritePlace extends AbstractModel<
  UserFavouritePlace,
  UserFavouritePlaceCreationArgs
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
}
