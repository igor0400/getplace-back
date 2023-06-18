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
import { EmployeesService } from 'src/services/employees/employees.service';
import { PLACES_ROLES_KEY } from '../decorators/places-roles.decorator';
import { Employee } from 'src/services/employees/models/employee.model';

@Injectable()
export class PlaceRolesGuard implements CanActivate {
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
        PLACES_ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      const placeId = context.getArgs()[0]?.body?.placeId;

      if (!placeId) {
        throw new HttpException(
          'Параметр placeId обязателен',
          HttpStatus.BAD_REQUEST,
        );
      }

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
          req.employee = employee;

          for (let place of employee.places) {
            if (place.id === placeId) {
              return place.employeeRoles.some((role) =>
                requiredRoles.includes(role.value),
              );
            }
          }

          throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
        });
    } catch (e) {
      if (e.message) {
        throw new HttpException(e.message, e.status);
      }

      throw new HttpException('Нет доступа', HttpStatus.FORBIDDEN);
    }
  }
}
