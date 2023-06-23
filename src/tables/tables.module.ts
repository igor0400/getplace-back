import { Module } from '@nestjs/common';
import { TablesService } from './tables.service';
import { TablesGateway } from './tables.gateway';
import { TablesController } from './tables.controller';
import { SeatsModule } from 'src/seats/seats.module';
import { TableRepository } from './repositories/table.repository';
import { Table } from './models/table.model';
import { DatabaseModule } from 'src/libs/common';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';

@Module({
  imports: [
    SeatsModule,
    DatabaseModule.forFeature([Table]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    EmployeesModule,
  ],
  providers: [TablesGateway, TablesService, TableRepository],
  controllers: [TablesController],
  exports: [TablesService],
})
export class TablesModule {}
