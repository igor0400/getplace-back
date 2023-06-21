import { Module } from '@nestjs/common';
import { EmployeesStartService } from './employees-start.service';
import { EmplayeesStartController } from './employees-start.controller';
import { UsersStartController } from './users-start.controller';
import { UsersStartService } from './users-start.service';
import { AuthModule } from '../auth/auth.module';
import { RolesModule } from '../roles/roles.module';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { StatusesModule } from 'src/statuses/statuses.module';

@Module({
  controllers: [EmplayeesStartController, UsersStartController],
  providers: [EmployeesStartService, UsersStartService],
  imports: [
    AuthModule,
    RolesModule,
    EmployeesModule,
    UsersModule,
    StatusesModule,
  ],
})
export class StartModule {}
