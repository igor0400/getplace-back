import { Injectable } from '@nestjs/common';
import { PromotionRepository } from './repositories/promotion.repository';
import { PromotionProductRepository } from './repositories/product.repository';
import { PromotionVisitTimeRepository } from './repositories/visit-time.repository';
import { CreatePromotionDto } from './dto/create-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly promotionProductRepository: PromotionProductRepository,
    private readonly promotionVisitTimeRepository: PromotionVisitTimeRepository,
  ) {}

  async createPromotion(dto: CreatePromotionDto) {}
}

// учитывать скидки при оплате
