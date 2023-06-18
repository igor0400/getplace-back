import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { Response, Request } from 'express';
import { EmployeesAuthService } from '../auth/employees-auth.service';
import { RolesService } from '../roles/roles.service';
import { EmployeesService } from '../employees/employees.service';

@Injectable()
export class EmployeesStartService {
  constructor(
    private authService: EmployeesAuthService,
    private rolesService: RolesService,
    private employeesService: EmployeesService,
  ) {}

  async createInitialData(
    dto: CreateInitialDataDto,
    response: Response,
    request: Request,
  ) {
    const ownerRole = await this.rolesService.findOrCreateRole({
      value: 'OWNER',
      description: 'Владелец заведения',
    });

    const adminRole = await this.rolesService.findOrCreateRole({
      value: 'ADMIN',
      description: 'Администратор',
    });

    const userRole = await this.rolesService.findOrCreateRole({
      value: 'USER',
      description: 'Пользователь',
    });

    if (!ownerRole || !adminRole || !userRole) {
      throw new UnauthorizedException('Ошибка создания роли');
    }

    const employeeData = await this.authService.createRegiserData(
      {
        ...dto,
        verifyCode: '000000',
      },
      response,
      request,
    );

    if (!employeeData) {
      throw new UnauthorizedException('Ошибка создания пользователя');
    }

    await this.employeesService.addRole({
      employeeId: employeeData.employee.id,
      value: 'ADMIN',
    });

    return {
      employeeData,
      roles: {
        ownerRole,
        adminRole,
        userRole,
      },
    };
  }
}
