import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Place } from './place.model';
import { AbstractModel } from 'src/libs/common';

export interface PlaceAddressCreationArgs {
  placeId: string;
  address: string;
  phone1?: string;
  phone2?: string;
  phone3?: string;
}

@Table({ tableName: 'place_address' })
export class PlaceAddress extends AbstractModel<
  PlaceAddress,
  PlaceAddressCreationArgs
> {
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
  address: string;

  @Column({
    type: DataType.STRING,
  })
  phone1: string;

  @Column({
    type: DataType.STRING,
  })
  phone2: string;

  @Column({
    type: DataType.STRING,
  })
  phone3: string;
}
