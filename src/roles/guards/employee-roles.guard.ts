import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { EmployeesService } from 'src/employees/employees.service';
import { EMPLOYEES_ROLES_KEY } from '../decorators/employees-roles.decorator';
import { Employee } from 'src/employees/models/employee.model';

@Injectable()
export class EmployeeRolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private employeeService: EmployeesService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        EMPLOYEES_ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader?.split(' ')[0];
      const token = authHeader?.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }

      const tokenInfo = this.jwtService.verify(token);

      return this.employeeService
        .getEmployeeById(tokenInfo.sub)
        .then((employee: Employee) => {
          req.user = employee;
          return employee.roles.some((role) =>
            requiredRoles.includes(role.value),
          );
        });
    } catch (e) {
      if (e.message) {
        throw new HttpException(e.message, e.status);
      }

      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
