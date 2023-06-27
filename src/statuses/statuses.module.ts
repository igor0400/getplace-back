import { Module, forwardRef } from '@nestjs/common';
import { StatusesService } from './statuses.service';
import { StatusesController } from './statuses.controller';
import { UserStatusesRepository } from './repositories/user-statuses.repository';
import { StatusRepository } from './repositories/statuses.repository';
import { DatabaseModule } from 'src/common';
import { Status } from './models/status.model';
import { UserStatuses } from './models/user-statuses.model';
import { JwtModule } from '@nestjs/jwt';
import { EmployeesModule } from 'src/employees/employees.module';
import { OrderStatusesRepository } from './repositories/order-statuses.repository';
import { OrderStatuses } from './models/order-statuses.model';

@Module({
  imports: [
    DatabaseModule.forFeature([Status, UserStatuses, OrderStatuses]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => EmployeesModule),
  ],
  controllers: [StatusesController],
  providers: [
    StatusesService,
    UserStatusesRepository,
    StatusRepository,
    OrderStatusesRepository,
  ],
  exports: [StatusesService, UserStatusesRepository],
})
export class StatusesModule {}
