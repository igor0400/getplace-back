import {
  UnprocessableEntityException,
  Injectable,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignOptions, TokenExpiredError } from 'jsonwebtoken';
import { refreshTokenTime } from './configs';
import { Employee } from '../employees/models/employee.model';
import { EmployeeSessionRepository } from '../sessions/repositories';
import { EmployeesService } from '../employees/employees.service';
import { EmployeesSessionsService } from '../sessions/employees-sessions.service';

export interface EmployeesRefreshTokenPayload {
  jti: string;
  sub: string;
  employeeIp: string;
  userAgent: string;
}

export interface EmployeeSessionOptions {
  employeeIp: string;
  userAgent: string;
}

interface CreateTokensType {
  accessToken: string;
  refreshToken: string;
  employee: Employee;
}

@Injectable()
export class EmployeesTokensService {
  public constructor(
    private readonly employeeSessionRepository: EmployeeSessionRepository,
    @Inject(forwardRef(() => EmployeesService))
    private employeesService: EmployeesService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => EmployeesSessionsService))
    private sessionsService: EmployeesSessionsService,
  ) {}

  public async generateAccessToken(employee: Employee): Promise<string> {
    const opts: SignOptions = {
      subject: employee.id.toString(),
    };

    return this.jwtService.signAsync({}, opts);
  }

  public async generateRefreshToken(
    employee: Employee,
    refreshOpts: EmployeeSessionOptions,
    expiresIn: number,
  ): Promise<string> {
    const employeeSession = await this.employeeSessionRepository.findOne({
      where: {
        employeeId: employee.id,
        ...refreshOpts,
      },
      include: { all: true },
    });

    const opts: SignOptions = {
      expiresIn,
      subject: employee.id.toString(),
    };

    if (employeeSession) {
      await this.sessionsService.updateSession(employeeSession, expiresIn);

      return this.jwtService.signAsync(refreshOpts, {
        ...opts,
        jwtid: employeeSession.id.toString(),
      });
    } else {
      const newSession = await this.sessionsService.createSession(
        employee.id,
        expiresIn,
        refreshOpts,
      );

      return this.jwtService.signAsync(refreshOpts, {
        ...opts,
        jwtid: newSession.id.toString(),
      });
    }
  }

  public async resolveEmployeeSession(
    encoded: string,
  ): Promise<{ employee: Employee }> {
    const payload = await this.decodeRefreshToken(encoded);

    const employee = await this.getEmployeeFromRefreshTokenPayload(payload);

    if (!employee) {
      throw new UnprocessableEntityException('Refresh токен неверного формата');
    }

    return { employee };
  }

  public async resolveEmployeeFromAccessToken(
    encoded: string,
  ): Promise<{ employee: Employee }> {
    const payload = await this.decodeAccessToken(encoded);

    const employee = await this.getEmployeeFromAccessTokenPayload(payload);

    if (!employee) {
      throw new UnprocessableEntityException('Access токен неверного формата');
    }

    return { employee };
  }

  public async createTokensFromRefreshToken(
    refresh: string,
    userAgent: string,
    employeeIp: string,
  ): Promise<CreateTokensType> {
    const { employee } = await this.resolveEmployeeSession(refresh);

    const employeeSession = await this.employeeSessionRepository.findOne({
      where: {
        employeeId: employee.id,
        employeeIp,
        userAgent,
      },
      include: { all: true },
    });

    if (!employeeSession) {
      throw new UnprocessableEntityException('Refresh токен не найден');
    }

    if (
      Date.parse(employeeSession.expires.toISOString()) <
      Date.parse(new Date().toISOString())
    ) {
      throw new UnprocessableEntityException(
        'Срок действия refresh токена истек',
      );
    }

    const addOptions = { employeeIp, userAgent };

    this.sessionsService.updateSession(employeeSession, refreshTokenTime);

    const accessToken = await this.generateAccessToken(employee);
    const refreshToken = await this.generateRefreshToken(
      employee,
      addOptions,
      refreshTokenTime,
    );

    return { employee, accessToken, refreshToken };
  }

  private async decodeRefreshToken(
    token: string,
  ): Promise<EmployeesRefreshTokenPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e instanceof TokenExpiredError) {
        throw new UnprocessableEntityException(
          'Истек срок действия refresh токена',
        );
      } else {
        throw new UnprocessableEntityException(
          'Refresh токен неверного формата',
        );
      }
    }
  }

  private async decodeAccessToken(
    token: string,
  ): Promise<{ iat?: number; exp?: number; sub: string }> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (e) {
      if (e) {
        throw new UnprocessableEntityException(
          'Истек срок действия access токена',
        );
      } else {
        throw new UnprocessableEntityException(
          'Access токен неверного формата',
        );
      }
    }
  }

  private async getEmployeeFromRefreshTokenPayload(
    payload: EmployeesRefreshTokenPayload,
  ): Promise<Employee> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('Refresh токен неверного формата');
    }

    return this.employeesService.getEmployeeById(subId);
  }

  private async getEmployeeFromAccessTokenPayload(payload: {
    iat?: number;
    exp?: number;
    sub: string;
  }): Promise<Employee> {
    const subId = payload.sub;

    if (!subId) {
      throw new UnprocessableEntityException('Refresh токен неверного формата');
    }

    return this.employeesService.getEmployeeById(subId);
  }
}
