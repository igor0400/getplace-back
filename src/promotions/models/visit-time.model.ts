import { Column, Table, DataType, ForeignKey } from 'sequelize-typescript';
import { AbstractModel } from 'src/common';
import { Promotion } from './promotion.model';

export interface PromotionVisitTimeCreationArgs {
  promotionId: string;
  from: string;
  till: string;
}

@Table({ tableName: 'promotion_visit_time' })
export class PromotionVisitTime extends AbstractModel<
  PromotionVisitTime,
  PromotionVisitTimeCreationArgs
> {
  @ForeignKey(() => Promotion)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  promotionId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  from: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  till: string;
}
