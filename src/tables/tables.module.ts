import { Module, forwardRef } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesGateway } from './tables.gateway';
import { TablesController } from './tables.controller';
import { SeatsModule } from 'src/seats/seats.module';
import { TableRepository } from './repositories/table.repository';
import { Table } from './models/table.model';
import { DatabaseModule } from 'src/libs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';
import { TableReservation } from './models/reservation.model';
import { ReservationUser } from './models/reservation-user.model';
import { TableReservationRepository } from './repositories/reservation.repository';
import { ReservationUserRepository } from './repositories/reservation-user.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([Table, TableReservation, ReservationUser]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => SeatsModule),
    EmployeesModule,
  ],
  providers: [
    TablesGateway,
    TablesService,
    TableRepository,
    TableReservationRepository,
    ReservationUserRepository,
  ],
  controllers: [TablesController],
  exports: [TablesService],
})
export class TablesModule {}
