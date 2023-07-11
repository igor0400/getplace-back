import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Place } from 'src/places/models/place.model';
import { promotionTypes } from '../configs/promotion-types';
import { PromotionTypes } from '../types/promotion-types';
import { promotionActionTypes } from '../configs/promotion-action-types';
import { PromotionActionTypes } from '../types/promotion-action-types';

export interface PromotionCreationArgs {
  placeId: string;
  title: string;
  description: string;
  type: PromotionTypes;
  actionType: PromotionActionTypes;
}

@Table({ tableName: 'promotions' })
export class Promotion extends AbstractModel<Promotion, PromotionCreationArgs> {
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
    type: DataType.STRING,
    allowNull: false,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...promotionTypes),
    allowNull: false,
  })
  type: PromotionTypes;

  @Column({
    type: DataType.ENUM(...promotionActionTypes),
    allowNull: false,
  })
  actionType: PromotionActionTypes;

  // cделать вложенные модели, продукт и тд (чек service)
}
