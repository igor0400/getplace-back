import { Injectable } from '@nestjs/common';
import { EmployeeSessionRepository } from './repositories/employee-session.repository';
import { EmployeeSessionOptions } from '../auth/employees-tokens.service';
import { EmployeeSession } from './models/employee-session.model';

@Injectable()
export class EmployeesSessionsService {
  constructor(
    private readonly employeeSessionRepository: EmployeeSessionRepository,
  ) {}

  async createSession(
    employeeId: string,
    ttl: number,
    addTokenOptions: EmployeeSessionOptions,
  ) {
    const expires = new Date();
    expires.setTime(expires.getTime() + ttl);

    const session = await this.employeeSessionRepository.create({
      employeeId,
      expires,
      ...addTokenOptions,
    });
    return session;
  }

  async updateSession(session: EmployeeSession, ttl: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + ttl);

    const employeeSession = await this.employeeSessionRepository.findOne({
      where: { id: session.id },
      include: { all: true },
    });

    employeeSession.expires = expires;
    return employeeSession.save();
  }

  async findSessionById(id: string) {
    const session = await this.employeeSessionRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return session;
  }
}
