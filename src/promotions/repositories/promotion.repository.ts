import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Promotion, PromotionCreationArgs } from '../models/promotion.model';

@Injectable()
export class PromotionRepository extends AbstractRepository<
  Promotion,
  PromotionCreationArgs
> {
  protected readonly logger = new Logger(Promotion.name);

  constructor(
    @InjectModel(Promotion)
    private promotionModel: typeof Promotion,
  ) {
    super(promotionModel);
  }
}
