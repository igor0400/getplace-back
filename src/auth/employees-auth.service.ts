import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { compare } from 'bcryptjs';
import {
  EmployeesLoginRequest,
  EmployeesRegisterRequest,
} from './dto/employees-requests.dto';
import { Response, Request } from 'express';
import { EmployeesTokensService } from './employees-tokens.service';
import { refreshTokenTime, refreshTokenTimeCookie } from './configs/tokens';
import { EmployeesService } from '../employees/employees.service';
import { EmployeesEmailService } from '../email/employees-email.service';

const cookiesSettings = {
  maxAge: refreshTokenTimeCookie,
  httpOnly: true,
  signed: true,
};

@Injectable()
export class EmployeesAuthService {
  constructor(
    @Inject(forwardRef(() => EmployeesService))
    private employeeService: EmployeesService,
    private tokensService: EmployeesTokensService,
    @Inject(forwardRef(() => EmployeesEmailService))
    private emailService: EmployeesEmailService,
  ) {}

  async register(
    registerRequest: EmployeesRegisterRequest,
    response: Response,
    request: Request,
  ) {
    const isEmployeeCreated = await this.employeeService.getEmployeeByEmail(
      registerRequest.email,
    );

    if (isEmployeeCreated) {
      throw new UnauthorizedException('Данный email уже используется');
    }

    const emailVerify = await this.emailService.checkVerifyCode(
      registerRequest.email,
      registerRequest.verifyCode,
    );

    if (!emailVerify) {
      throw new UnauthorizedException(
        'Неправильный код проверки email, возможно он устарел',
      );
    }

    const regData = await this.createRegiserData(
      registerRequest,
      response,
      request,
    );

    return regData;
  }

  async createRegiserData(
    registerRequest: EmployeesRegisterRequest,
    response: Response,
    request: Request,
  ) {
    const employeeIp = request.ip;
    const userAgent = request.headers['user-agent'];
    const requestCopy = JSON.parse(JSON.stringify(registerRequest));
    if (requestCopy?.verifyCode) delete requestCopy.verifyCode;

    const employee = await this.employeeService.createEmployee({
      ...requestCopy,
      emailVerify: true,
    });

    const accessToken = await this.tokensService.generateAccessToken(employee);
    const refreshToken = await this.tokensService.generateRefreshToken(
      employee,
      { employeeIp, userAgent },
      refreshTokenTime,
    );

    response.cookie('refreshToken', refreshToken, cookiesSettings);

    const currentEmployee = await this.employeeService.getEmployeeByEmail(
      registerRequest.email,
    );

    return { accessToken, refreshToken, employee: currentEmployee };
  }

  async login(
    loginRequest: EmployeesLoginRequest,
    response: Response,
    request: Request,
  ) {
    const employeeIp = request.ip;
    const userAgent = request.headers['user-agent'];
    const { password, email } = loginRequest;

    const employee = await this.employeeService.getEmployeeByEmail(email);

    if (employee) {
      const valid = await compare(password, employee.password);

      if (!valid) {
        throw new UnauthorizedException('Неверный пароль');
      }

      const accessToken = await this.tokensService.generateAccessToken(
        employee,
      );
      const refreshToken = await this.tokensService.generateRefreshToken(
        employee,
        { employeeIp, userAgent },
        refreshTokenTime,
      );

      response.cookie('refreshToken', refreshToken, cookiesSettings);

      const currentEmployee = await this.employeeService.getEmployeeByEmail(
        email,
      );
      return { accessToken, employee: currentEmployee };
    }

    throw new UnauthorizedException('Пользователь с таким email не найден');
  }

  async refresh(request: Request, response: Response) {
    const cookiesRefreshToken =
      request.cookies.refreshToken ?? request.signedCookies.refreshToken;

    const { employee, accessToken, refreshToken } =
      await this.tokensService.createTokensFromRefreshToken(
        cookiesRefreshToken,
        request.headers['user-agent'],
        request.ip,
      );

    response.cookie('refreshToken', refreshToken, cookiesSettings);

    return { accessToken, employee };
  }
}
