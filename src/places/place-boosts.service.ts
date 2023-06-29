import { Injectable } from '@nestjs/common';
import { BoostsService } from 'src/boosts/boosts.service';
import { PlaceBoostsRepository } from 'src/boosts/repositories/place-boosts.repository';
import { CreatePlaceBoostDto } from './dto/create-place-boost.dto';

@Injectable()
export class PlaceBoostsService {
  constructor(
    private readonly placeBoostsRepository: PlaceBoostsRepository,
    private readonly boostsService: BoostsService,
  ) {}

  async createPlaceBoost(dto: CreatePlaceBoostDto) {
    const { placeId, boostValue } = dto;
    const boost = await this.boostsService.getBoostByValue(boostValue);
    const placeBoost = await this.placeBoostsRepository.create({
      placeId,
      boostId: boost.id,
    });

    return placeBoost;
  }

  async deletePlaceBoost(dto: CreatePlaceBoostDto) {
    const { placeId, boostValue } = dto;
    const boost = await this.boostsService.getBoostByValue(boostValue);
    const deleteCount = await this.placeBoostsRepository.destroy({
      where: {
        placeId,
        boostId: boost.id,
      },
    });

    return deleteCount;
  }
}
