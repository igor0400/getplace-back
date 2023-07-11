import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Promotion } from './promotion.model';
import { ProductTypes } from '../types/product-types';
import { productTypes } from '../configs/product-types';
import { Dish } from 'src/dishes/models/dish.model';

export interface PromotionProductCreationArgs {
  promotionId: string;
  type: ProductTypes;
  dishId?: string;
}

@Table({ tableName: 'promotion_products' })
export class PromotionProduct extends AbstractModel<
  PromotionProduct,
  PromotionProductCreationArgs
> {
  @ForeignKey(() => Promotion)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  promotionId: string;

  @Column({
    type: DataType.ENUM(...productTypes),
    allowNull: false,
  })
  type: ProductTypes;

  @ForeignKey(() => Dish)
  @Column({
    type: DataType.STRING,
  })
  dishId: string;
}
