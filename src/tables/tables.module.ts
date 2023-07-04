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

@Module({
  imports: [
    DatabaseModule.forFeature([Table]),
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
  ],
  providers: [TablesGateway, TablesService, TableRepository],
  controllers: [TablesController],
  exports: [TablesService],
})
export class TablesModule {}
