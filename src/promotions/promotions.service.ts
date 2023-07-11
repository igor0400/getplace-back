import { BadRequestException, Injectable } from '@nestjs/common';
import { PromotionRepository } from './repositories/promotion.repository';
import { PromotionProductRepository } from './repositories/product.repository';
import { PromotionVisitTimeRepository } from './repositories/visit-time.repository';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { Op } from 'sequelize';
import { PromotionProduct } from './models/product.model';
import { PromotionVisitTime } from './models/visit-time.model';

export const promotionsInclude = [PromotionProduct, PromotionVisitTime];

@Injectable()
export class PromotionsService {
  constructor(
    private readonly promotionRepository: PromotionRepository,
    private readonly promotionProductRepository: PromotionProductRepository,
    private readonly promotionVisitTimeRepository: PromotionVisitTimeRepository,
  ) {}

  async getAllPromotions(
    limit: number,
    offset: number,
    search: string = '',
    where: any | undefined = {},
  ) {
    const promotions = await this.promotionRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
      include: promotionsInclude,
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
        ...where,
      },
    });

    return promotions;
  }

  async createPromotion(dto: CreatePromotionDto) {
    const {
      placeId,
      description,
      type,
      actionType,
      discountAmount,
      buyFromAmount,
      buyFromCurrency,
      dishId,
      visitTimeFrom,
      visitTimeTill,
    } = dto;

    const title = this.generateTitle(dto);

    const promotion = await this.promotionRepository.create({
      placeId,
      title,
      description,
      type,
      actionType,
      discountAmount,
      buyFromAmount,
      buyFromCurrency,
    });

    if (dishId) {
      await this.promotionProductRepository.create({
        promotionId: promotion.id,
        type: 'dish',
        dishId,
      });
    }

    if (visitTimeFrom && visitTimeTill) {
      await this.promotionVisitTimeRepository.create({
        promotionId: promotion.id,
        from: visitTimeFrom,
        till: visitTimeTill,
      });
    }

    return promotion;
  }

  async deletePromotionById(id: string) {
    const deleteCount = await this.promotionRepository.destroy({
      where: {
        id,
      },
    });

    await this.promotionProductRepository.destroy({
      where: {
        promotionId: id,
      },
    });

    await this.promotionVisitTimeRepository.destroy({
      where: {
        promotionId: id,
      },
    });

    return deleteCount;
  }

  private generateTitle(dto: CreatePromotionDto) {
    const {
      type,
      actionType,
      discountAmount,
      buyFromAmount,
      visitTimeFrom,
      visitTimeTill,
    } = dto;
    let result = '';

    if (type === 'discount') {
      this.checkRequiredField(discountAmount, 'discountAmount');

      result += `Скидка ${discountAmount}%`;
    }
    if (type === 'freeProduct') {
      result += 'Бесплатный продукт';
    }

    if (actionType === 'firstVisit') {
      result += ' при первом посещении';
    }

    if (actionType === 'buyFrom') {
      this.checkRequiredField(buyFromAmount, 'buyFromAmount');

      result += ` при заказе от ${buyFromAmount}`;
    }

    if (actionType === 'visitFromTill') {
      this.checkRequiredField(visitTimeFrom, 'visitTimeFrom');
      this.checkRequiredField(visitTimeTill, 'visitTimeTill');

      result += ` при посещении с ${visitTimeFrom} до ${visitTimeTill}`;
    }

    return result;
  }

  private checkRequiredField(value: any, name: string) {
    if (!value) {
      throw new BadRequestException(`Поле ${name} обязательно`);
    }
  }
}
