import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './models/user.model';
import { hash, compare } from 'bcryptjs';
import { AddRoleDto } from './dto/add-role.dto';
import { ChangeUserDto } from './dto/change-user.dto';
import { Op } from 'sequelize';
import { ChangePasswordDto } from './dto/change-password.dto';
import { uid } from 'uid';
import { Role } from '../roles/models/roles.model';
import { UserSession } from '../sessions/models/user-session.model';
import { Referals } from '../referals/models/referal.model';
import { UsersRepository } from './repositories/users.repository';
import { UserRolesRepository } from '../roles/repositories/user-roles.repository';
import { UserSessionRepository } from '../sessions/repositories/user-session.repository';
import { RolesService } from '../roles/roles.service';
import { UsersEmailService } from '../email/users-email.service';
import { StatusesService } from 'src/statuses/statuses.service';
import { AddStatusDto } from './dto/add-status.dto';
import { UserStatusesRepository } from 'src/statuses/repositories/user-statuses.repository';
import { Status } from 'src/statuses/models/status.model';

export const usersInclude = [
  { model: Role },
  { model: Status },
  { model: UserSession },
  {
    model: Referals,
    include: [
      { model: User, as: 'inviter' },
      { model: User, as: 'invitedUsers' },
    ],
  },
];

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly userRolesRepository: UserRolesRepository,
    private readonly userSessionRepository: UserSessionRepository,
    private readonly userStatusesRepository: UserStatusesRepository,
    private roleService: RolesService,
    private statusesService: StatusesService,
    private emailService: UsersEmailService,
  ) {}

  async getAllUsers(limit: number, offset: number, search: string = '') {
    const users = await this.userRepository.findAll({
      offset: offset || 0,
      limit: limit || 20,
      include: usersInclude,
      where: {
        email: {
          [Op.like]: `%${search}%`,
        },
      },
      order: ['id'],
    });

    return users;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findByPk(id, {
      include: usersInclude,
    });

    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
      include: usersInclude,
    });

    return user;
  }

  async getUserByReferalCode(referalCode: string) {
    const user = await this.userRepository.findOne({
      where: { referalCode },
      include: usersInclude,
    });

    return user;
  }

  async createUser(userDto: CreateUserDto) {
    const password = await hash(userDto.password, 10);

    const user = await this.userRepository.create({
      ...userDto,
      password,
    });

    if (!user) {
      throw new UnauthorizedException('Ошибка создания пользователя');
    }

    const { id } = user;

    await this.addRole({ value: 'USER', userId: id });
    await this.addStatus({ value: 'DEFAULT', userId: id });

    user.referalCode = uid(12);
    user.save();

    return this.getUserById(id);
  }

  async deleteUserById(id: string) {
    const isDeleted = await this.userRepository.destroy({
      where: { id },
    });

    return isDeleted;
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);

    if (role && user) {
      const userRole = {
        userId: dto.userId,
        roleId: role.id,
      };
      await this.userRolesRepository.create(userRole);
      return userRole;
    }

    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async addStatus(dto: AddStatusDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const status = await this.statusesService.getStatusByValue(dto.value);

    if (status && user) {
      const userStatus = await this.userStatusesRepository.create({
        userId: dto.userId,
        statusId: status.id,
      });
      return userStatus;
    }

    throw new HttpException(
      'Пользователь или статус не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async changeUser(dto: ChangeUserDto) {
    const { verifyCode, userId } = dto;
    const verify = await this.emailService.checkVerifyCode(
      userId.toString(),
      verifyCode,
    );

    if (!verify) {
      throw new HttpException(
        'Неправильный код подтверждения, возможно он устарел',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findByPk(userId);

    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.BAD_REQUEST);
    }

    for (let key in dto) {
      if (user[key] !== undefined) {
        user[key] = dto[key];
      }
    }

    return user.save();
  }

  async changePassword(dto: ChangePasswordDto) {
    const { userId, verifyCode, newPassword, oldPassword } = dto;
    const verify = await this.emailService.checkVerifyCode(
      userId.toString(),
      verifyCode,
    );

    if (!verify) {
      throw new HttpException(
        'Неправильный код подтверждения, возможно он устарел',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      include: usersInclude,
    });

    const valid = await compare(oldPassword, user.password);

    if (!valid) {
      throw new HttpException(
        'Неверно введен текущий пароль',
        HttpStatus.BAD_REQUEST,
      );
    }

    const password = await hash(newPassword, 10);

    user.password = password;

    await this.userSessionRepository.destroy({ where: { userId } });

    return user.save();
  }
}
