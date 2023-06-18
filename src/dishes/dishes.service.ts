import { Injectable } from '@nestjs/common';
import { DishRepository } from './repositories/dish.repository';
import { CreateDishDto } from './dto/create-dish.dto';

@Injectable()
export class DishesService {
  constructor(private readonly dishRepository: DishRepository) {}

  async createDish(dto: CreateDishDto) {
    const dish = await this.dishRepository.create(dto);
    return dish;
  }
}
