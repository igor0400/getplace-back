import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtModule } from '@nestjs/jwt';
import { forwardRef } from '@nestjs/common/utils';
import { DatabaseModule } from 'src/common';
import { RolesController } from './roles.controller';
import { EmployeePlaceRoles } from './models/employee-place-roles.model';
import { EmployeeRoles } from './models/employee-roles.model';
import { Role } from './models/roles.model';
import { UserRoles } from './models/user-roles.model';
import { EmployeesModule } from '../employees/employees.module';
import { UsersModule } from '../users/users.module';
import { EmployeePlaceRolesRepository } from './repositories/employee-place-roles.repository';
import { EmployeeRolesRepository } from './repositories/employee-roles.repository';
import { RolesRepository } from './repositories/roles.repository';
import { UserRolesRepository } from './repositories/user-roles.repository';

@Module({
  providers: [
    RolesService,
    EmployeePlaceRolesRepository,
    EmployeeRolesRepository,
    RolesRepository,
    UserRolesRepository,
  ],
  controllers: [RolesController],
  imports: [
    DatabaseModule.forFeature([
      EmployeePlaceRoles,
      EmployeeRoles,
      Role,
      UserRoles,
    ]),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY,
      signOptions: {
        expiresIn: process.env.JWT_EXPIRES_IN,
      },
    }),
    forwardRef(() => EmployeesModule),
    forwardRef(() => UsersModule),
  ],
  exports: [
    RolesService,
    EmployeePlaceRolesRepository,
    EmployeeRolesRepository,
    RolesRepository,
    UserRolesRepository,
  ],
})
export class RolesModule {}
