import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateInitialDataDto } from './dto/create-initial-data.dto';
import { Response, Request } from 'express';
import { UsersAuthService } from '../auth/users-auth.service';
import { RolesService } from '../roles/roles.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class UsersStartService {
  constructor(
    private authService: UsersAuthService,
    private rolesService: RolesService,
    private usersService: UsersService,
  ) {}

  async createInitialData(
    dto: CreateInitialDataDto,
    response: Response,
    request: Request,
  ) {
    const userRole = await this.rolesService.findOrCreateRole({
      value: 'USER',
      description: 'Пользователь',
    });

    const adminRole = await this.rolesService.findOrCreateRole({
      value: 'ADMIN',
      description: 'Администратор',
    });

    if (!userRole || !adminRole) {
      throw new UnauthorizedException('Ошибка создания роли');
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
      roles: {
        userRole,
        adminRole,
      },
    };
  }
}
