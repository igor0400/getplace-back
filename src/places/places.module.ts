import { Module, forwardRef } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { Place } from './models/place.model';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/libs/common';
import { PlaceAddress } from './models/address.model';
import { PlaceEmployees } from './models/employees.model';
import { FavouritePlaces } from './models/favourite-places.model';
import { PlaceImages } from './models/images.model';
import { WorkDays } from './models/work-days.model';
import { WorkTime } from './models/work-time.model';
import { PlaceWork } from './models/work.model';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { EmployeesModule } from '../employees/employees.module';
import { RolesModule } from '../roles/roles.module';
import { PlaceRepository } from './repositories/place.repository';
import { PlaceWorkRepository } from './repositories/work.repository';
import { PlaceEmployeesRepository } from './repositories/employees.repository';
import { PlaceImagesRepository } from './repositories/images.repository';
import { FavouritePlacesRepository } from './repositories/favourite-places.repository';
import { PlaceAddressRepository } from './repositories/address.repository';
import { WorkDaysRepository } from './repositories/work-days.repository';
import { WorkTimeRepository } from './repositories/work-time.repository';

@Module({
  controllers: [PlacesController],
  providers: [
    PlacesService,
    PlaceRepository,
    PlaceWorkRepository,
    PlaceEmployeesRepository,
    PlaceImagesRepository,
    FavouritePlacesRepository,
    PlaceAddressRepository,
    WorkDaysRepository,
    WorkTimeRepository,
  ],
  imports: [
    DatabaseModule.forFeature([
      Place,
      PlaceAddress,
      PlaceEmployees,
      FavouritePlaces,
      PlaceImages,
      WorkDays,
      WorkTime,
      PlaceWork,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => RestaurantsModule),
    forwardRef(() => EmployeesModule),
    forwardRef(() => RolesModule),
  ],
})
export class PlacesModule {}
