import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { Response, Request } from 'express';
import { UsersAuthService } from '../auth/users-auth.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';
import { usersRoles } from './configs/users-roles';
import { usersStatuses } from './configs/users-statuses';
import { StatusesService } from 'src/statuses/statuses.service';

@Injectable()
export class UsersStartService {
  constructor(
    private authService: UsersAuthService,
    private rolesService: RolesService,
    private usersService: UsersService,
    private statusesService: StatusesService,
  ) {}

  async createInitialData(
    dto: CreateInitialDataDto,
    response: Response,
    request: Request,
  ) {
    const roles = [];

    for (let role of usersRoles) {
      const createdRole = await this.rolesService.findOrCreateRole(role);

      if (!createdRole) {
        throw new UnauthorizedException(`Ошибка создания роли ${role.value}`);
      }

      roles.push(createdRole);
    }

    const statuses = [];

    for (let status of usersStatuses) {
      const createdStatus = await this.statusesService.findOrCreateStatus(
        status,
      );

      if (!createdStatus) {
        throw new UnauthorizedException(
          `Ошибка создания статуса пользователя: ${status.value}`,
        );
      }

      statuses.push(createdStatus);
    }

    const userData = await this.authService.createRegiserData(
      {
        ...dto,
        verifyCode: '000000',
      },
      response,
      request,
    );

    if (!userData) {
      throw new UnauthorizedException('Ошибка создания пользователя');
    }

    await this.usersService.addRole({
      userId: userData.user.id,
      value: 'ADMIN',
    });

    return {
      userData,
      roles,
      statuses,
    };
  }
}
