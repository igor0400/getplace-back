import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
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
import { CreatePlaceEmployeeDto } from './dto/create-place-employee.dto';
import { EmployeesService } from 'src/employees/employees.service';
import { ChangePlaceEmployeeDto } from './dto/change-place-employee.dto';
import { DishFood } from 'src/dishes/models/food.model';
import { DishDrink } from 'src/dishes/models/drink.model';
import { ChangePlaceDto } from './dto/change-place.dto';
import { FilesService } from 'src/files/files.service';
import { PlaceImagesRepository } from './repositories/images.repository';

const placesInclude = [
  { model: PlaceWork, include: [WorkDays, WorkTime] },
  PlaceAddress,
  {
    model: Restaurant,
    include: [{ model: Dish, include: [DishFood, DishDrink, File] }],
  },
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
    private readonly placeImagesRepository: PlaceImagesRepository,
    private readonly employeePlaceRolesRepository: EmployeePlaceRolesRepository,
    private readonly restaurantService: RestaurantsService,
    private readonly rolesService: RolesService,
    private readonly employeesService: EmployeesService,
    private readonly filesService: FilesService,
  ) {}

  async getAllPlaces(
    limit: number,
    offset: number,
    search: string = '',
    accepted: boolean = false,
    notAccepted: boolean = false,
  ) {
    const isAccepted = accepted
      ? { isAccepted: true }
      : notAccepted
      ? { isAccepted: false }
      : {};

    const places = await this.placeRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      include: placesInclude,
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
        ...isAccepted,
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

  async createPlace(dto: CreatePlaceDto, images?: Express.Multer.File[]) {
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
      address,
      phone1: contactPhone1,
      phone2: contactPhone2,
      phone3: contactPhone3,
    });

    const placeEmployee = await this.placeEmployeesRepository.create({
      placeId: place.id,
      employeeId,
      title: 'Владелец',
    });

    await this.addPlaceEmployeeRole(placeEmployee.id, 'OWNER');

    if (dto.type === 'restaurant') {
      await this.restaurantService.createRestaurant(place.id);
    }

    if (images) {
      for (let image of images) {
        const fileData = await this.filesService.createImage(image);
        await this.placeImagesRepository.create({
          placeId: place.id,
          fileId: fileData.file.id,
        });
      }
    }

    return this.getPlaceById(place.id);
  }

  async changePlace(dto: ChangePlaceDto) {
    const {
      placeId,
      workDaysFrom,
      workDaysTill,
      workTimeFrom,
      workTimeTill,
      address,
      contactPhone1,
      contactPhone2,
      contactPhone3,
    } = dto;

    const place = await this.getPlaceById(placeId);

    for (let item in dto) {
      if (place[item]) {
        place[item] = dto[item];
      }
    }

    place.save();

    const work = await this.placeWorkRepository.findOne({
      where: {
        placeId,
      },
    });

    // смена или создание дней работы
    const workDays = await this.workDaysRepository.findOne({
      where: {
        workId: work.id,
      },
    });

    if (workDays) {
      if (workDaysFrom) workDays.from = workDaysFrom;
      if (workDaysTill) workDays.till = workDaysTill;
      workDays.save();
    } else {
      await this.workDaysRepository.create({
        workId: work.id,
        from: workDaysFrom ?? 'Понедельник',
        till: workDaysTill ?? 'Пятница',
      });
    }

    // смена или создание времени работы
    const workTime = await this.workTimeRepository.findOne({
      where: {
        workId: work.id,
      },
    });

    if (workTime) {
      if (workTimeFrom) workTime.from = workTimeFrom;
      if (workTimeTill) workTime.till = workTimeTill;
      workTime.save();
    } else {
      await this.workTimeRepository.create({
        workId: work.id,
        from: workTimeFrom ?? '08:00',
        till: workTimeTill ?? '22:00',
      });
    }

    // смена адреса
    const placeAddres = await this.placeAddressRepository.findOne({
      where: {
        placeId,
      },
    });

    if (placeAddres) {
      if (address) placeAddres.address = address;
      if (contactPhone1) placeAddres.phone1 = contactPhone1;
      if (contactPhone2) placeAddres.phone2 = contactPhone2;
      if (contactPhone3) placeAddres.phone3 = contactPhone3;
      placeAddres.save();
    } else {
      await this.placeAddressRepository.create({
        placeId,
        address,
        phone1: contactPhone1,
        phone2: contactPhone2,
        phone3: contactPhone3,
      });
    }

    const newPlace = await this.getPlaceById(place.id);
    return newPlace;
  }

  async deletePlaceById(id: string) {
    const deleteCount = await this.placeRepository.destroy({
      where: { id },
    });

    const work = await this.placeWorkRepository.findOne({
      where: {
        placeId: id,
      },
    });

    await this.placeAddressRepository.destroy({ where: { placeId: id } });

    if (work) {
      await this.workDaysRepository.destroy({ where: { workId: work.id } });
      await this.workTimeRepository.destroy({ where: { workId: work.id } });
      await this.placeWorkRepository.destroy({ where: { placeId: id } });
    }

    return deleteCount;
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

  async createEmployee(dto: CreatePlaceEmployeeDto) {
    const { placeId, employeeEmail, title, roles } = dto;

    const employee = await this.employeesService.getEmployeeByEmail(
      employeeEmail,
    );

    if (!employee) {
      throw new NotFoundException(
        `Сотрудник с email: ${employeeEmail}, не найден. Возможно он еще не зарегестрировался.`,
      );
    }

    const isCreated = await this.isEmployeeCreated(employeeEmail, placeId);

    if (isCreated) {
      throw new BadRequestException(
        `Сотрудник с email: ${employeeEmail} уже существует`,
      );
    }

    const placeEmployee = await this.placeEmployeesRepository.create({
      placeId,
      employeeId: employee.id,
      title,
    });

    for (let roleValue of roles) {
      await this.addPlaceEmployeeRole(placeEmployee.id, roleValue);
    }

    return this.getPlaceEmployeeById(placeEmployee.id);
  }

  async changeEmployee(dto: ChangePlaceEmployeeDto) {
    const { placeEmployeeId, title, roles } = dto;

    const placeEmployee = await this.getPlaceEmployeeById(placeEmployeeId);

    if (!placeEmployee) {
      throw new NotFoundException('Сотрудник не найден');
    }

    if (roles) {
      await this.employeePlaceRolesRepository.destroy({
        where: {
          placeEmployeeId,
        },
      });
      for (let roleValue of roles) {
        await this.addPlaceEmployeeRole(placeEmployee.id, roleValue);
      }
    }

    if (title) {
      placeEmployee.title = title;
      placeEmployee.save();
    }

    return this.getPlaceEmployeeById(placeEmployee.id);
  }

  async deleteEmployee(placeEmployeeId: string) {
    const deleteCount = await this.placeEmployeesRepository.destroy({
      where: { id: placeEmployeeId },
    });

    await this.employeePlaceRolesRepository.destroy({
      where: {
        placeEmployeeId,
      },
    });

    return deleteCount;
  }

  async getPlaceEmployeeById(id: string) {
    const employee = await this.placeEmployeesRepository.findByPk(id, {
      include: [Role],
    });

    return employee;
  }

  async isEmployeeCreated(email: string, placeId: string) {
    const employee = await this.employeesService.getEmployeeByEmail(email);
    const placeEmployee = await this.placeEmployeesRepository.findOne({
      where: {
        employeeId: employee.id,
        placeId,
      },
    });

    if (placeEmployee) return true;

    return false;
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
      place.isAccepted = true;
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
