import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { DatabaseModule } from 'src/libs/common';
import { RestaurantRepository } from './repositories';
import { Restaurant } from './models/restaurant.model';

@Module({
  controllers: [RestaurantsController],
  providers: [RestaurantsService, RestaurantRepository],
  imports: [DatabaseModule.forFeature([Restaurant])],
  exports: [RestaurantsService, RestaurantRepository],
})
export class RestaurantsModule {}
