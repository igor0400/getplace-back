import {
  Param,
  Controller,
  Delete,
  Get,
  UseGuards,
  Post,
  Body,
  Query,
  Patch,
  Req,
} from '@nestjs/common';
import { CustomReq } from 'src/common';
import { AddRoleDto } from './dto/add-role.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangeUserDto } from './dto/change-user.dto';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiDefaultResponse,
  ApiQuery,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRolesGuard } from '../roles/guards/user-roles.guard';
import { UsersRoles } from '../roles/decorators/users-roles.decorator';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiDefaultResponse({ description: 'Получение всех пользователей' })
  @ApiQuery({
    name: 'limit',
    description: 'Ограничение колличества',
    required: false,
  })
  @ApiQuery({
    name: 'offset',
    description: 'Отступ от начала',
    required: false,
  })
  @ApiQuery({ name: 'search', description: 'Поиск по email', required: false })
  @Get()
  getAllUsers(
    @Query('limit') limit: string,
    @Query('offset') offset: string,
    @Query('search') search: string,
  ) {
    return this.usersService.getAllUsers(+limit, +offset, search);
  }

  @ApiDefaultResponse({
    description: 'Изменение пользователя (только с Bearer токеном)',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Patch()
  changeUser(@Body() dto: ChangeUserDto, @Req() req: CustomReq) {
    return this.usersService.changeUser({ ...dto, userId: req.user.sub });
  }

  @ApiDefaultResponse({
    description: 'Добывление роли пользователю (только с ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @UsersRoles('ADMIN')
  @UseGuards(UserRolesGuard)
  @Post('add-role')
  addRole(@Body() dto: AddRoleDto) {
    return this.usersService.addRole(dto);
  }

  @ApiDefaultResponse({
    description: 'Изменение пароля (только с Bearer токеном)',
  })
  @ApiBearerAuth('Bearer token')
  @UseGuards(JwtAuthGuard)
  @Patch('change-pass')
  changePassword(@Body() dto: ChangePasswordDto, @Req() req: CustomReq) {
    return this.usersService.changePassword({
      ...dto,
      userId: req.user.sub,
    });
  }

  @ApiDefaultResponse({
    description: 'Получение пользователя по id',
  })
  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.usersService.getUserById(id);

    if (user) {
      return user;
    } else {
      return `Пользователь с id: ${id} не найден`;
    }
  }

  @ApiDefaultResponse({
    description: 'Удаление пользователя (только с ролью ADMIN)',
  })
  @ApiSecurity('ADMIN only')
  @UsersRoles('ADMIN')
  @UseGuards(UserRolesGuard)
  @Delete(':id')
  deleteUserById(@Param('id') id: string) {
    return this.usersService.deleteUserById(id);
  }
}
