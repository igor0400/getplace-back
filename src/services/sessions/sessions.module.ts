import { Module } from '@nestjs/common';
import { EmployeesSessionsService } from './employees-sessions.service';
import { DatabaseModule } from 'src/libs/common';
import { UsersSessionsService } from './users-sessions.service';
import {
  UserSessionRepository,
  EmployeeSessionRepository,
} from './repositories';
import { EmployeeSession } from './models/employee-session.model';
import { UserSession } from './models/user-session.model';

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
