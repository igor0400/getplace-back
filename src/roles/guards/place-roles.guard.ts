import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { EmployeesService } from 'src/employees/employees.service';
import { PLACES_ROLES_KEY } from '../decorators/places-roles.decorator';
import { Employee } from 'src/employees/models/employee.model';

@Injectable()
export class PlaceRolesGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private employeeService: EmployeesService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        PLACES_ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      let placeId = context.getArgByIndex(0)?.body?.placeId;

      if (!placeId) {
        const request = context.switchToHttp().getRequest();
        const bufferData = request?._readableState?.buffer?.head?.data;

        if (bufferData) {
          const requestBody = Buffer.concat([bufferData]).toString();

          const strBody = requestBody.replaceAll('\r', '').split('\n');

          for (let item of strBody) {
            if (item.includes('placeId')) {
              placeId = strBody[strBody.indexOf(item) + 2];
            }
          }
        }

        if (!placeId) {
          throw new BadRequestException('Параметр placeId обязателен');
        }
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

      if (!requiredRoles) {
        return true;
      }

      const tokenInfo = this.jwtService.verify(token);

      return this.employeeService
        .getEmployeeById(tokenInfo.sub)
        .then((employee: Employee) => {
          if (!employee) {
            throw new UnauthorizedException('Сотрудник не найден');
          }

          req.employee = employee;

          for (let place of employee.places) {
            if (place.placeId === placeId) {
              for (let role of place.employeeRoles) {
                if (requiredRoles.includes(role.value)) return true;
              }
            }
          }

          throw new HttpException(
            `Нет роли: ${requiredRoles.join(' или ')}`,
            HttpStatus.FORBIDDEN,
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
