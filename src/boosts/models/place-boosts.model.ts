import { Column, DataType, ForeignKey, Table } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Boost } from './boost.model';
import { Place } from 'src/places/models/place.model';

export interface PlaceBoostsCreationArgs {
  boostId: string;
  placeId: string;
}

@Table({ tableName: 'place_boosts', timestamps: false })
export class PlaceBoosts extends AbstractModel<
  PlaceBoosts,
  PlaceBoostsCreationArgs
> {
  @ForeignKey(() => Boost)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  boostId: string;

  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;
}
