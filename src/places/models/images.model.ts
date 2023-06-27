import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Place } from './place.model';
import { AbstractModel } from 'src/common';
import { File } from 'src/files/models/file.model';

export interface PlaceImagesCreationArgs {
  id: string;
  placeId: string;
  fileId: string;
}

@Table({ tableName: 'place_images', timestamps: false })
export class PlaceImages extends AbstractModel<
  PlaceImages,
  PlaceImagesCreationArgs
> {
  @ForeignKey(() => Place)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  placeId: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileId: string;
}
