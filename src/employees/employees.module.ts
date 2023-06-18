import { forwardRef, Module } from '@nestjs/common';
import { Employee } from './models/employee.model';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesRepository } from './repositories/employees.repository';
import { DatabaseModule } from 'src/libs/common';
import { RolesModule } from '../roles/roles.module';
import { AuthModule } from '../auth/auth.module';
import { EmailModule } from '../email/email.module';
import { SessionsModule } from '../sessions/sessions.module';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService, EmployeesRepository],
  imports: [
    DatabaseModule.forFeature([Employee]),
    forwardRef(() => RolesModule),
    forwardRef(() => AuthModule),
    forwardRef(() => EmailModule),
    SessionsModule,
  ],
  exports: [EmployeesService, EmployeesRepository],
})
export class EmployeesModule {}
