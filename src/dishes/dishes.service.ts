import { Injectable } from '@nestjs/common';
import { DishRepository } from './repositories/dish.repository';
import { CreateDishDto } from './dto/create-dish.dto';
import { DishFoodRepository } from './repositories/food.repository';
import { DishDrinkRepository } from './repositories/drink.repository';
import { ChangeDishDto } from './dto/change-dish.dto';
import { DishDrink } from './models/drink.model';
import { DishFood } from './models/food.model';
import { FilesService } from 'src/files/files.service';
import { DishImagesRepository } from './repositories/images.repository';
import { File } from 'src/files/models/file.model';

const dishInclude = [DishDrink, DishFood, File];

@Injectable()
export class DishesService {
  constructor(
    private readonly dishRepository: DishRepository,
    private readonly dishFoodRepository: DishFoodRepository,
    private readonly dishDrinkRepository: DishDrinkRepository,
    private readonly dishImagesRepository: DishImagesRepository,
    private readonly filesService: FilesService,
  ) {}

  async getDishById(id: string) {
    const dish = await this.dishRepository.findByPk(id, {
      include: dishInclude,
    });

    return dish;
  }

  async createDish(dto: CreateDishDto, images?: Express.Multer.File[]) {
    const {
      title,
      description,
      catigory,
      type,
      cost,
      position,
      weight,
      size,
      volume,
    } = dto;

    const dish = await this.dishRepository.create({
      title,
      description,
      catigory,
      type,
      cost,
      position,
    });

    if (volume) {
      await this.dishDrinkRepository.create({
        dishId: dish.id,
        volume,
      });
    }

    if (weight || size) {
      await this.dishFoodRepository.create({
        dishId: dish.id,
        weight,
        size,
      });
    }

    if (images) {
      await this.createDishImages(images, dish.id);
    }

    return this.getDishById(dish.id);
  }

  async changeDish(dto: ChangeDishDto, images?: Express.Multer.File[]) {
    const { dishId, weight, size, volume } = dto;

    const dish = await this.getDishById(dishId);

    for (let item in dto) {
      if (dish[item]) {
        dish[item] = dto[item];
      }
    }

    dish.save();

    if (weight || size) {
      const food = await await this.dishFoodRepository.findOne({
        where: {
          dishId,
        },
      });
      if (food) {
        if (weight) food.weight = weight;
        if (size) food.size = size;
        food.save();
      } else {
        await this.dishFoodRepository.create({
          dishId,
          weight,
          size,
        });
      }
    }

    if (volume) {
      const drink = await await this.dishDrinkRepository.findOne({
        where: {
          dishId,
        },
      });

      if (drink) {
        if (volume) drink.volume = volume;
        drink.save();
      } else {
        await this.dishDrinkRepository.create({
          dishId,
          volume,
        });
      }
    }

    if (images) {
      await this.deleteDishImages(dish.images);
      await this.createDishImages(images, dish.id);
    }

    return this.getDishById(dish.id);
  }

  async deleteDishById(id: string) {
    const dish = await this.getDishById(id);

    const deleteCount = await this.dishRepository.destroy({
      where: {
        id,
      },
    });
    await this.dishDrinkRepository.destroy({
      where: {
        dishId: id,
      },
    });
    await this.dishFoodRepository.destroy({
      where: {
        dishId: id,
      },
    });

    if (dish.images) {
      await this.deleteDishImages(dish.images);
    }

    return deleteCount;
  }

  private async createDishImages(
    images: Express.Multer.File[],
    dishId: string,
  ) {
    for (let image of images) {
      const fileData = await this.filesService.createImage(image);
      await this.dishImagesRepository.create({
        dishId,
        fileId: fileData.file.id,
      });
    }
  }

  private async deleteDishImages(images: File[]) {
    for (let dishImage of images) {
      await this.filesService.deleteFile(dishImage.id);
    }
  }
}
