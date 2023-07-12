import { Module } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { DatabaseModule } from 'src/common';
import { Promotion } from './models/promotion.model';
import { PromotionProduct } from './models/product.model';
import { PromotionVisitTime } from './models/visit-time.model';
import { PromotionRepository } from './repositories/promotion.repository';
import { PromotionProductRepository } from './repositories/product.repository';
import { PromotionVisitTimeRepository } from './repositories/visit-time.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([
      Promotion,
      PromotionProduct,
      PromotionVisitTime,
    ]),
  ],
  controllers: [PromotionsController],
  providers: [
    PromotionsService,
    PromotionRepository,
    PromotionProductRepository,
    PromotionVisitTimeRepository,
  ],
  exports: [PromotionsService, PromotionRepository],
})
export class PromotionsModule {}
