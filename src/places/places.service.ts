import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { Op } from 'sequelize';
import { ModeratePlaceDto } from './dto/moderate-place.dto';
import { PlaceWork } from './models/work.model';
import { File } from '../files/models/file.model';
import { PlaceAddress } from './models/address.model';
import { Restaurant } from '../restaurants/models/restaurant.model';
import { Dish } from '../dishes/models/dish.model';
import { WorkDays } from './models/work-days.model';
import { WorkTime } from './models/work-time.model';
import { PlaceEmployees } from './models/employees.model';
import { Role } from '../roles/models/roles.model';
import { Employee } from '../employees/models/employee.model';
import { PlaceRepository } from './repositories/place.repository';
import { PlaceWorkRepository } from './repositories/work.repository';
import { WorkDaysRepository } from './repositories/work-days.repository';
import { WorkTimeRepository } from './repositories/work-time.repository';
import { PlaceAddressRepository } from './repositories/address.repository';
import { PlaceEmployeesRepository } from './repositories/employees.repository';
import { EmployeePlaceRolesRepository } from '../roles/repositories/employee-place-roles.repository';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { RolesService } from '../roles/roles.service';
import { Place } from './models/place.model';

const placesInclude = [
  { model: PlaceWork, include: [WorkDays, WorkTime] },
  PlaceAddress,
  { model: Restaurant, include: [Dish] },
  { model: File },
  { model: PlaceEmployees, include: [Role, Employee] },
];

@Injectable()
export class PlacesService {
  constructor(
    private readonly placeRepository: PlaceRepository,
    private readonly placeWorkRepository: PlaceWorkRepository,
    private readonly workDaysRepository: WorkDaysRepository,
    private readonly workTimeRepository: WorkTimeRepository,
    private readonly placeAddressRepository: PlaceAddressRepository,
    private readonly placeEmployeesRepository: PlaceEmployeesRepository,
    private readonly employeePlaceRolesRepository: EmployeePlaceRolesRepository,
    private restaurantService: RestaurantsService,
    private rolesService: RolesService,
  ) {}

  async getAllPlaces(limit: number, offset: number, search: string = '') {
    const places = await this.placeRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      include: placesInclude,
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
      },
      order: ['id'],
    });

    return places;
  }

  async getPlaceById(id: string): Promise<Place> {
    const place = await this.placeRepository.findOne({
      where: { id },
      include: placesInclude,
    });

    return place;
  }

  async createPlace(dto: CreatePlaceDto) {
    const place = await this.placeRepository.create(dto);

    if (!place) {
      throw new UnauthorizedException('Ошибка создания заведения');
    }

    const {
      workDaysFrom,
      workDaysTill,
      workTimeFrom,
      workTimeTill,
      address,
      contactPhone1,
      contactPhone2,
      contactPhone3,
      employeeId,
    } = dto;
    const work = await this.placeWorkRepository.create({ placeId: place.id });
    await this.workDaysRepository.create({
      workId: work.id,
      from: workDaysFrom,
      till: workDaysTill,
    });
    await this.workTimeRepository.create({
      workId: work.id,
      from: workTimeFrom,
      till: workTimeTill,
    });
    await this.placeAddressRepository.create({
      placeId: place.id,
      title: address,
      phone1: contactPhone1,
      phone2: contactPhone2,
      phone3: contactPhone3,
    });

    const placeEmployee = await this.placeEmployeesRepository.create({
      placeId: place.id,
      employeeId,
    });

    await this.addPlaceEmployeeRole(placeEmployee.id, 'OWNER');

    if (dto.type === 'restaurant') {
      await this.restaurantService.createRestaurant(place.id);
    }

    return this.getPlaceById(place.id);
  }

  async addPlaceEmployeeRole(placeEmployeeId: string, value: string) {
    const role = await this.rolesService.getRoleByValue(value);

    if (!role) {
      throw new HttpException('Роль не найдена', HttpStatus.BAD_REQUEST);
    }

    return this.employeePlaceRolesRepository.create({
      placeEmployeeId,
      roleId: role.id,
    });
  }

  async deletePlaceById(id: string) {
    const deleteCount = await this.placeRepository.destroy({
      where: { id },
    });

    return deleteCount;
  }

  moderatePlaceById(dto: ModeratePlaceDto) {
    const { solution, placeId } = dto;

    if (solution === 'accept') {
      return this.acceptPlaceById(placeId);
    } else {
      return this.rejectPlaceById(placeId);
    }
  }

  private async acceptPlaceById(id: string) {
    const place = await this.placeRepository.findByPk(id);

    if (place) {
      place.accepted = true;
      place.save();
      return true;
    }

    throw new HttpException(
      `Заведение с id: ${id} не найдено`,
      HttpStatus.BAD_REQUEST,
    );
  }

  private async rejectPlaceById(id: string) {
    const isDeleted = await this.placeRepository.destroy({
      where: { id },
    });

    return isDeleted;
  }
}
