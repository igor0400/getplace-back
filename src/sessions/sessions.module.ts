import { Module } from '@nestjs/common';
import { EmployeesSessionsService } from './employees-sessions.service';
import { DatabaseModule } from 'src/common';
import { UsersSessionsService } from './users-sessions.service';
import { EmployeeSession } from './models/employee-session.model';
import { UserSession } from './models/user-session.model';
import { EmployeeSessionRepository } from './repositories/employee-session.repository';
import { UserSessionRepository } from './repositories/user-session.repository';

@Module({
  providers: [
    EmployeesSessionsService,
    EmployeeSessionRepository,
    UsersSessionsService,
    UserSessionRepository,
  ],
  imports: [DatabaseModule.forFeature([EmployeeSession, UserSession])],
  exports: [
    EmployeesSessionsService,
    EmployeeSessionRepository,
    UsersSessionsService,
    UserSessionRepository,
  ],
})
export class SessionsModule {}
