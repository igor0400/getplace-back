import { Module, forwardRef } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { SeatRepository } from './repositories/seat.repository';
import { DatabaseModule } from 'src/libs/common';
import { Seat } from './models/seat.model';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';
import { TablesModule } from 'src/tables/tables.module';
import { ReservationUserSeatRepository } from './repositories/reservation-user-seat.repository';
import { ReservationUserSeat } from './models/reservation-user-seat.model';

@Module({
  imports: [
    DatabaseModule.forFeature([Seat, ReservationUserSeat]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => TablesModule),
    EmployeesModule,
  ],
  providers: [SeatsService, SeatRepository, ReservationUserSeatRepository],
  controllers: [SeatsController],
  exports: [SeatsService],
})
export class SeatsModule {}
