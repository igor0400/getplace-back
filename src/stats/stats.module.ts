import { Module, forwardRef } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';
import { TablesModule } from 'src/tables/tables.module';
import { PlacesModule } from 'src/places/places.module';
import { RoomsModule } from 'src/rooms/rooms.module';
import { DatabaseModule } from 'src/common';
import { PlaceStat } from './models/place-stat.model';
import { PlaceGuests } from './models/place-guests.model';
import { PlaceStatItem } from './models/place-stat-item.model';
import { PlaceStatRepository } from './repositories/place-stat.repository';
import { PlaceGuestsRepository } from './repositories/place-guests.repository';
import { PlaceStatItemRepository } from './repositories/place-stat-item.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([PlaceStat, PlaceGuests, PlaceStatItem]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    EmployeesModule,
    forwardRef(() => TablesModule),
    forwardRef(() => PlacesModule),
    forwardRef(() => RoomsModule),
    forwardRef(() => TablesModule),
  ],
  controllers: [StatsController],
  providers: [
    StatsService,
    PlaceStatRepository,
    PlaceGuestsRepository,
    PlaceStatItemRepository,
  ],
  exports: [
    StatsService,
    PlaceStatRepository,
    PlaceGuestsRepository,
    PlaceStatItemRepository,
  ],
})
export class StatsModule {}
