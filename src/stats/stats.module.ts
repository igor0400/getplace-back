import { Module } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';
import { TablesModule } from 'src/tables/tables.module';
import { PlacesModule } from 'src/places/places.module';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    EmployeesModule,
    TablesModule,
    PlacesModule,
    RoomsModule,
    TablesModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
