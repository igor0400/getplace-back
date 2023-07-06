import { Module, forwardRef } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesGateway } from './tables.gateway';
import { TablesController } from './tables.controller';
import { SeatsModule } from 'src/seats/seats.module';
import { TableRepository } from './repositories/table.repository';
import { Table } from './models/table.model';
import { DatabaseModule } from 'src/common';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';
import { OrdersModule } from 'src/orders/orders.module';
import { ReservationsModule } from 'src/reservations/reservations.module';
import { FreeTable } from './models/free-table.model';
import { FreeTableRepository } from './repositories/free-table.repository';
import { PlacesModule } from 'src/places/places.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Table, FreeTable]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => SeatsModule),
    forwardRef(() => OrdersModule),
    forwardRef(() => EmployeesModule),
    forwardRef(() => ReservationsModule),
    forwardRef(() => PlacesModule),
  ],
  providers: [
    TablesGateway,
    TablesService,
    TableRepository,
    FreeTableRepository,
  ],
  controllers: [TablesController],
  exports: [TablesService, FreeTableRepository],
})
export class TablesModule {}
