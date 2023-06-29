import { Body, Controller, Post, Get, Res, Req } from '@nestjs/common';
import { EmployeesAuthService } from './employees-auth.service';
import {
  EmployeesLoginRequest,
  EmployeesRegisterRequest,
} from './dto/employees-requests.dto';
import { Response, Request } from 'express';
import {
  ApiBody,
  ApiCookieAuth,
  ApiDefaultResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Авторизация сотрудников')
@Controller('auth/employees')
export class EmployeesAuthController {
  constructor(private authService: EmployeesAuthService) {}

  @ApiDefaultResponse({ description: 'Регистрация' })
  @ApiBody({
    type: EmployeesRegisterRequest,
  })
  @Post('register')
  public async register(
    @Body() registerRequest: EmployeesRegisterRequest,
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.authService.register(registerRequest, response, request);
  }

  @ApiDefaultResponse({ description: 'Вход' })
  @ApiBody({
    description: 'Вход',
    type: EmployeesLoginRequest,
  })
  @Post('login')
  public async login(
    @Body() loginRequest: EmployeesLoginRequest,
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
}
