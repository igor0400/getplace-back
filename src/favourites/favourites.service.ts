import { Injectable } from '@nestjs/common';
import { UserFavouritePlaceRepository } from './repositories/user-favourite-place.repository';
import { CreateUserFavouritePlaceDto } from './dto/create-user-favourite-place.dto';

@Injectable()
export class FavouritesService {
  constructor(
    private readonly userFavouritePlaceRepository: UserFavouritePlaceRepository,
  ) {}

  async getAllUserFavouritePlaces(
    userId: string,
    limit: number,
    offset: number,
  ) {
    const favourites = await this.userFavouritePlaceRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      where: { userId },
    });

    return favourites;
  }

  async createUserFavouritePlace(dto: CreateUserFavouritePlaceDto) {
    const favourite = await this.userFavouritePlaceRepository.findOrCreate({
      where: { ...dto },
    });

    return favourite;
  }

  async deleteUserFavouritePlace(dto: CreateUserFavouritePlaceDto) {
    const deleteCount = await this.userFavouritePlaceRepository.destroy({
      where: { ...dto },
    });

    return deleteCount;
  }
}
