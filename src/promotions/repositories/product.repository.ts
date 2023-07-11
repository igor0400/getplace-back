import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PromotionProduct,
  PromotionProductCreationArgs,
} from '../models/product.model';

@Injectable()
export class PromotionProductRepository extends AbstractRepository<
  PromotionProduct,
  PromotionProductCreationArgs
> {
  protected readonly logger = new Logger(PromotionProduct.name);

  constructor(
    @InjectModel(PromotionProduct)
    private promotionProductModel: typeof PromotionProduct,
  ) {
    super(promotionProductModel);
  }
}
