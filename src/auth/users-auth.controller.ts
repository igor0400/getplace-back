import { Body, Controller, Post, Get, Res, Req } from '@nestjs/common';
import { UsersAuthService } from './users-auth.service';
import {
  ChangePasswordRequest,
  UsersLoginRequest,
  UsersRegisterRequest,
} from './dto/users-requests.dto';
import { Response, Request } from 'express';
import {
  ApiBody,
  ApiCookieAuth,
  ApiDefaultResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CustomReq } from 'src/common';
import { UsersService } from 'src/users/users.service';

@ApiTags('Авторизация пользователей')
@Controller('auth/users')
export class UsersAuthController {
  constructor(
    private readonly authService: UsersAuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiDefaultResponse({ description: 'Регистрация' })
  @ApiBody({
    description: 'Регистрация',
    type: UsersRegisterRequest,
  })
  @Post('register')
  public async register(
    @Body() registerRequest: UsersRegisterRequest,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.register(registerRequest, response, request);
  }

  @ApiDefaultResponse({ description: 'Вход' })
  @ApiBody({
    description: 'Вход',
    type: UsersLoginRequest,
  })
  @Post('login')
  public async login(
    @Body() loginRequest: UsersLoginRequest,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.login(loginRequest, response, request);
  }

  @ApiDefaultResponse({
    description: 'Обновление токенов (только с cookies)',
  })
  @ApiCookieAuth('только с cookies')
  @Get('refresh')
  public async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refresh(request, response);
  }

  @ApiDefaultResponse({
    description: 'Смена пароля',
  })
  @Post('change-password')
  public async changePassword(@Body() dto: ChangePasswordRequest) {
    return this.authService.changePassword(dto);
  }
}
