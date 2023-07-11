import { Injectable } from '@nestjs/common';
import { BoostRepository } from './repositories/boost.repository';
import { CreateBoostDto } from './dto/create-boost.dto';
import { ChangeBoostDto } from './dto/change-boost.dto';
import { Op } from 'sequelize';

@Injectable()
export class BoostsService {
  constructor(private readonly boostRepository: BoostRepository) {}

  async getAllBoosts(limit: number, offset: number, search: string = '') {
    const boosts = await this.boostRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
      where: {
        value: {
          [Op.like]: `%${search}%`,
        },
      },
    });

    return boosts;
  }

  async getBoostById(id: string) {
    const boost = await this.boostRepository.findOne({
      where: { id },
    });
    return boost;
  }

  async getBoostByValue(value: string) {
    const boost = await this.boostRepository.findOne({ where: { value } });
    return boost;
  }

  async createBoost(dto: CreateBoostDto) {
    const boost = await this.boostRepository.create(dto);
    return boost;
  }

  async findOrCreateBoost(dto: CreateBoostDto) {
    const boost = await this.getBoostByValue(dto.value);

    if (boost) return boost;

    return this.createBoost(dto);
  }

  async changeBoost(dto: ChangeBoostDto) {
    const boost = await this.boostRepository.findOne({
      where: { id: dto.boostId },
    });

    for (let key in dto) {
      if (boost[key]) {
        boost[key] = dto[key];
      }
    }

    return boost.save();
  }
}
