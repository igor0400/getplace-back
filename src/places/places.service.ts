import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
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
import { PlaceRepository } from './repositories/place.repository';
import { PlaceWorkRepository } from './repositories/work.repository';
import { WorkDaysRepository } from './repositories/work-days.repository';
import { WorkTimeRepository } from './repositories/work-time.repository';
import { PlaceAddressRepository } from './repositories/address.repository';
import { PlaceEmployeesRepository } from './repositories/employees.repository';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { DishFood } from 'src/dishes/models/food.model';
import { DishDrink } from 'src/dishes/models/drink.model';
import { ChangePlaceDto } from './dto/change-place.dto';
import { FilesService } from 'src/files/files.service';
import { PlaceImagesRepository } from './repositories/images.repository';
import { Room } from 'src/rooms/models/room.model';
import { Table } from 'src/tables/models/table.model';
import { Seat } from 'src/seats/models/seat.model';
import { Boost } from 'src/boosts/models/boost.model';
import { RoomsService } from 'src/rooms/rooms.service';
import { TablesService } from 'src/tables/tables.service';
import { ValidationsService } from 'src/reservations/validations.service';
import { PlaceEmployeesService } from './employees/place-employees.service';
import { ReservationsService } from 'src/reservations/reservations.service';

const placesInclude = [
  { model: PlaceWork, include: [WorkDays, WorkTime] },
  Restaurant,
  File,
  PlaceAddress,
  Boost,
  Table,
];

const placesChangeFreeTablesInclude = [
  { model: Room, include: [{ model: Table }] },
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
    private readonly restaurantService: RestaurantsService,
    private readonly filesService: FilesService,
    private readonly roomsService: RoomsService,
    @Inject(forwardRef(() => TablesService))
    private readonly tablesService: TablesService,
    @Inject(forwardRef(() => ValidationsService))
    private readonly validationsService: ValidationsService,
    private readonly placeEmployeesService: PlaceEmployeesService,
    @Inject(forwardRef(() => ReservationsService))
    private readonly reservationsService: ReservationsService,
  ) {}

  async getAllUpdatedPlaces(
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
      limit: limit || 10,
      include: placesChangeFreeTablesInclude,
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
        ...isAccepted,
      },
    });

    for (let place of places) {
      await this.validationsService.changeFreeTablesByPlaceData(place);
    }

    return await this.placeRepository.findAll({
      offset: offset || 0,
      limit: limit || 10,
      include: placesInclude,
      where: {
        title: {
          [Op.like]: `%${search}%`,
        },
        ...isAccepted,
      },
    });
  }

  async getUpdatedPlaceById(id: string) {
    const place = await this.placeRepository.findOne({
      where: { id },
      include: placesChangeFreeTablesInclude,
    });

    await this.validationsService.changeFreeTablesByPlaceData(place);

    return this.getPlaceById(id);
  }

  async getPlaceById(id: string) {
    const place = await this.placeRepository.findOne({
      where: { id },
      include: placesInclude,
    });

    return place;
  }

  async getPlaceByRoomId(roomId: string) {
    const room = await this.roomsService.getRoomById(roomId);

    if (!room) throw new BadRequestException('Зал не найден');

    const place = await this.getPlaceById(room.placeId);

    return place;
  }

  async getPlaceByTableId(tableId: string) {
    const table = await this.tablesService.getTableById(tableId);

    if (!table) throw new BadRequestException('Стол не найден');

    const place = await this.getPlaceByRoomId(table.roomId);

    return place;
  }

  async getPlaceByReservationId(reservationId: string) {
    const reservation = await this.reservationsService.getReservationById(
      reservationId,
    );

    if (!reservation) throw new BadRequestException('Бронь не найдена');

    const table = await this.tablesService.getTableById(reservation.tableId);

    if (!table) throw new BadRequestException('Стол не найден');

    const place = await this.getPlaceByRoomId(table.roomId);

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

    await this.placeEmployeesService.addPlaceEmployeeRole(
      placeEmployee.id,
      'OWNER',
    );

    if (dto.type === 'restaurant') {
      await this.restaurantService.createRestaurant(place.id);
    }

    if (images) {
      await this.createPlaceImages(images, place.id);
    }

    return this.getPlaceById(place.id);
  }

  async changePlace(dto: ChangePlaceDto, images?: Express.Multer.File[]) {
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

    if (images) {
      await this.deletePlaceImages(place.images);
      await this.createPlaceImages(images, place.id);
    }

    return this.getPlaceById(place.id);
  }

  async deletePlaceById(id: string) {
    const place = await this.getPlaceById(id);

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

    if (place.images) {
      await this.deletePlaceImages(place.images);
    }

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

  private async createPlaceImages(
    images: Express.Multer.File[],
    placeId: string,
  ) {
    for (let image of images) {
      const fileData = await this.filesService.createImage(image);
      await this.placeImagesRepository.create({
        placeId,
        fileId: fileData.file.id,
      });
    }
  }

  private async deletePlaceImages(images: File[]) {
    for (let placeImage of images) {
      await this.filesService.deleteFile(placeImage.id);
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
