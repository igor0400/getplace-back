import { Injectable } from '@nestjs/common';
import { UserSession } from './models/user-session.model';
import { UserSessionOptions } from '../auth/users-tokens.service';
import { UserSessionRepository } from './repositories/user-session.repository';

@Injectable()
export class UsersSessionsService {
  constructor(private readonly userSessionRepository: UserSessionRepository) {}

  async createSession(
    userId: string,
    ttl: number,
    addTokenOptions: UserSessionOptions,
  ) {
    const expires = new Date();
    expires.setTime(expires.getTime() + ttl);

    const session = await this.userSessionRepository.create({
      userId,
      expires,
      ...addTokenOptions,
    });
    return session;
  }

  async updateSession(session: UserSession, ttl: number) {
    const expires = new Date();
    expires.setTime(expires.getTime() + ttl);

    const userSession = await this.userSessionRepository.findOne({
      where: { id: session.id },
      include: { all: true },
    });

    userSession.expires = expires;
    return userSession.save();
  }

  async findSessionById(id: string) {
    const session = await this.userSessionRepository.findOne({
      where: { id },
      include: { all: true },
    });
    return session;
  }
}
