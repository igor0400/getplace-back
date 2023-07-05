import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { Response, Request } from 'express';
import { EmployeesAuthService } from '../auth/employees-auth.service';
import { RolesService } from '../roles/roles.service';
import { EmployeesService } from '../employees/employees.service';
import { employeesRoles } from './configs/employees-roles';

@Injectable()
export class EmployeesStartService {
  constructor(
    private authService: EmployeesAuthService,
    private rolesService: RolesService,
    private employeesService: EmployeesService,
  ) {}

  // Сделать все в один сервис
  // Сделать запрос test с создание тестового заведения, столов, сидений, броней и тд (данные для них просто захардкодить)

  async createInitialData(
    dto: CreateInitialDataDto,
    response: Response,
    request: Request,
  ) {
    const roles = [];

    for (let role of employeesRoles) {
      const createdRole = await this.rolesService.findOrCreateRole(role);

      if (!createdRole) {
        throw new UnauthorizedException(`Ошибка создания роли ${role.value}`);
      }

      roles.push(createdRole);
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
      roles,
    };
  }
}
