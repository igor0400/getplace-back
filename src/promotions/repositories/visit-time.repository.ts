import { AbstractRepository } from 'src/common';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import {
  PromotionVisitTime,
  PromotionVisitTimeCreationArgs,
} from '../models/visit-time.model';

@Injectable()
export class PromotionVisitTimeRepository extends AbstractRepository<
  PromotionVisitTime,
  PromotionVisitTimeCreationArgs
> {
  protected readonly logger = new Logger(PromotionVisitTime.name);

  constructor(
    @InjectModel(PromotionVisitTime)
    private promotionVisitTimeModel: typeof PromotionVisitTime,
  ) {
    super(promotionVisitTimeModel);
  }
}
