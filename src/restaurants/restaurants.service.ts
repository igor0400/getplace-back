import { Injectable } from '@nestjs/common';
import { RestaurantRepository } from './repositories/restaurants.repository';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async createRestaurant(placeId: string) {
    const place = await this.restaurantRepository.create({ placeId });
    return place;
  }

  async deleteRestaurantById(id: string) {
    const isDeleted = await this.restaurantRepository.destroy({
      where: { id },
    });
    return isDeleted;
  }
}
