import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { Dish } from './dish.model';
import { AbstractModel } from 'src/common';
import { File } from 'src/files/models/file.model';

export interface DishImagesCreationArgs {
  dishId: string;
  fileId: string;
}

@Table({ tableName: 'dish_images', timestamps: false })
export class DishImages extends AbstractModel<
  DishImages,
  DishImagesCreationArgs
> {
  @ForeignKey(() => Dish)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  dishId: string;

  @ForeignKey(() => File)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  fileId: string;
}
