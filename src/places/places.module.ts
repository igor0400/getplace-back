import { Module, forwardRef } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { Place } from './models/place.model';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from 'src/common';
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
import { FilesModule } from 'src/files/files.module';
import { PlaceBoostsController } from './boosts/place-boosts.controller';
import { PlaceBoostsService } from './boosts/place-boosts.service';
import { BoostsModule } from 'src/boosts/boosts.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { TablesModule } from 'src/tables/tables.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import { PlaceReviewsController } from './reviews/place-reviews.controller';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { PlaceEmployeesController } from './employees/place-employees.controller';
import { PlaceEmployeesService } from './employees/place-employees.service';
import { PlaceRoomsController } from './rooms/place-rooms.controller';
import { PromotionsModule } from 'src/promotions/promotions.module';
import { PlacePromotionsController } from './promotions/place-promotions.controller';

@Module({
  controllers: [
    PlaceReviewsController,
    PlaceBoostsController,
    PlaceEmployeesController,
    PlaceRoomsController,
    PlacePromotionsController,
    PlacesController,
  ],
  providers: [
    PlacesService,
    PlaceBoostsService,
    PlaceEmployeesService,
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
    forwardRef(() => FilesModule),
    forwardRef(() => BoostsModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => TablesModule),
    forwardRef(() => ReviewsModule),
    forwardRef(() => ReservationsModule),
    PromotionsModule,
  ],
  exports: [PlacesService],
})
export class PlacesModule {}
