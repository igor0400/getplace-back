import { Injectable, UnauthorizedException, Inject, forwardRef } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { UsersTokensService } from './users-tokens.service';
import {
  UsersLoginRequest,
  UsersRegisterRequest,
} from './dto/users-requests.dto';
import { Response, Request } from 'express';
import { refreshTokenTime, refreshTokenTimeCookie } from './configs';
import { UsersService } from '../users/users.service';
import { UsersEmailService } from '../email/users-email.service';
import { ReferalsService } from '../referals/referals.service';

const cookiesSettings = {
  maxAge: refreshTokenTimeCookie,
  httpOnly: true,
  signed: true,
};

@Injectable()
export class UsersAuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
    @Inject(forwardRef(() => UsersTokensService))
    private tokensService: UsersTokensService,
    @Inject(forwardRef(() => UsersEmailService))
    private emailService: UsersEmailService,
    @Inject(forwardRef(() => ReferalsService))
    private referalsService: ReferalsService,
  ) {}

  async register(
    registerRequest: UsersRegisterRequest,
    response: Response,
    request: Request,
  ) {
    const isUserCreated = await this.userService.getUserByEmail(
      registerRequest.email,
    );

    if (isUserCreated) {
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
    registerRequest: UsersRegisterRequest,
    response: Response,
    request: Request,
  ) {
    const userIp = request.ip;
    const userAgent = request.headers['user-agent'];
    const requestCopy = JSON.parse(JSON.stringify(registerRequest));
    if (requestCopy?.verifyCode) delete requestCopy.verifyCode;
    if (requestCopy?.referalCode) delete requestCopy.referalCode;

    const user = await this.userService.createUser({
      ...requestCopy,
      emailVerify: true,
    });

    const accessToken = await this.tokensService.generateAccessToken(user);
    const refreshToken = await this.tokensService.generateRefreshToken(
      user,
      { userIp, userAgent },
      refreshTokenTime,
    );

    response.cookie('refreshToken', refreshToken, cookiesSettings);

    if (registerRequest.referalCode) {
      await this.referalsService.createUserReferals(
        registerRequest.referalCode,
        user.id,
      );
    }

    const currentUser = await this.userService.getUserByEmail(
      registerRequest.email,
    );

    return { accessToken, refreshToken, user: currentUser };
  }

  async login(
    loginRequest: UsersLoginRequest,
    response: Response,
    request: Request,
  ) {
    const userIp = request.ip;
    const userAgent = request.headers['user-agent'];
    const { password, email } = loginRequest;

    const user = await this.userService.getUserByEmail(email);

    if (user) {
      const valid = await compare(password, user.password);

      if (!valid) {
        throw new UnauthorizedException('Неверный пароль');
      }

      const accessToken = await this.tokensService.generateAccessToken(user);
      const refreshToken = await this.tokensService.generateRefreshToken(
        user,
        { userIp, userAgent },
        refreshTokenTime,
      );

      response.cookie('refreshToken', refreshToken, cookiesSettings);

      const currentUser = await this.userService.getUserByEmail(email);
      return { accessToken, user: currentUser };
    }

    throw new UnauthorizedException('Пользователь с таким email не найден');
  }

  async refresh(request: Request, response: Response) {
    const cookiesRefreshToken =
      request.cookies.refreshToken ?? request.signedCookies.refreshToken;

    const { user, accessToken, refreshToken } =
      await this.tokensService.createTokensFromRefreshToken(
        cookiesRefreshToken,
        request.headers['user-agent'],
        request.ip,
      );

    response.cookie('refreshToken', refreshToken, cookiesSettings);

    return { accessToken, user };
  }
}
