import { MailerService } from '@nestjs-modules/mailer';
import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { join } from 'path';
import { uid } from 'uid';
import { UsersRepository } from '../users/repositories/users.repository';
import { RedisCacheService } from '../redis/redis.service';

@Injectable()
export class UsersEmailService {
  constructor(
    private readonly userRepository: UsersRepository,
    private mailerService: MailerService,
    private redisService: RedisCacheService,
  ) {}

  async sendVerifyCode(email: string) {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (user) {
      throw new UnauthorizedException('Данный email уже используется');
    }

    const verifyCode = uid(10);
    await this.redisService.set(email, verifyCode);

    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Код подтверждения',
        template: join(__dirname, './templates', 'verifyEmail'),
        context: {
          verifyCode,
        },
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          'Ошибка работы почты',
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }

  async checkVerifyCode(field: string, code: string): Promise<boolean> {
    const redisCode = await this.redisService.get(field);

    if (redisCode === code) {
      await this.redisService.del(field);
      return true;
    } else return false;
  }

  async sendChangePassCode(userId: string) {
    const user = await this.userRepository.findByPk(userId);

    const { id, email } = user;

    const verifyCode = uid(10);
    await this.redisService.set(id.toString(), verifyCode);

    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Код подтверждения',
        template: join(__dirname, './templates', 'changePassword'),
        context: {
          verifyCode,
        },
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Ошибка работы почты`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }

  async sendDefaultCode(userId: string) {
    const user = await this.userRepository.findByPk(userId);

    const { id, email } = user;

    const verifyCode = uid(10);
    await this.redisService.set(id.toString(), verifyCode);

    return await this.mailerService
      .sendMail({
        to: email,
        subject: 'Код подтверждения',
        template: join(__dirname, './templates', 'default'),
        context: {
          verifyCode,
        },
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException(
          `Ошибка работы почты`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      });
  }
}
