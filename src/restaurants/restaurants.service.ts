import {
  Inject,
  Injectable,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { RestaurantRepository } from './repositories/restaurants.repository';
import { DishesService } from 'src/dishes/dishes.service';
import { CreateRestaurantDishDto } from './dto/create-dish.dto';
import { RestaurantDishesRepository } from './repositories/restaurant-dishes.repository';
import { PlacesService } from 'src/places/places.service';
import { ChangeRestaurantDishDto } from './dto/change-dish.dto';

@Injectable()
export class RestaurantsService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly restaurantDishesRepository: RestaurantDishesRepository,
    private readonly dishesService: DishesService,
    @Inject(forwardRef(() => PlacesService))
    private readonly placeService: PlacesService,
  ) {}

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

  async createDish(
    dto: CreateRestaurantDishDto,
    images?: Express.Multer.File[],
  ) {
    const dishDto = JSON.parse(JSON.stringify(dto));
    delete dishDto.placeId;

    const dish = await this.dishesService.createDish(dishDto, images);

    const place = await this.placeService.getPlaceById(dto.placeId);

    if (!place) {
      throw new NotFoundException('Заведение не найдено');
    }
    const restaurantDish = await this.restaurantDishesRepository.create({
      restaurantId: place.restaurantInfo.id,
      dishId: dish.id,
    });

    return {
      restaurantDish,
      dishInfo: dish,
    };
  }

  async changeDish(
    dto: ChangeRestaurantDishDto,
    images?: Express.Multer.File[],
  ) {
    const dishDto = JSON.parse(JSON.stringify(dto));
    delete dishDto.placeId;

    const dish = await this.dishesService.changeDish(dishDto, images);
    return dish;
  }

  async deleteDishById(id: string) {
    await this.dishesService.deleteDishById(id);
    await this.restaurantDishesRepository.destroy({
      where: {
        dishId: id,
      },
    });

    return true;
  }
}
