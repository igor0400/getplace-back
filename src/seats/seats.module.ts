import { Module } from '@nestjs/common';
import { SeatsService } from './seats.service';
import { SeatsGateway } from './seats.gateway';
import { SeatsController } from './seats.controller';
import { SeatRepository } from './repositories/seat.repository';
import { DatabaseModule } from 'src/libs/common';
import { Seat } from './models/seat.model';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Seat]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    EmployeesModule,
  ],
  providers: [SeatsGateway, SeatsService, SeatRepository],
  controllers: [SeatsController],
  exports: [SeatsService],
})
export class SeatsModule {}
