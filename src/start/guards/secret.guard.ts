import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SecretGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      let secret = req?.body?.secret;

      if (!secret) {
        const request = context.switchToHttp().getRequest();
        const bufferData = request?._readableState?.buffer?.head?.data;

        if (bufferData) {
          const requestBody = Buffer.concat([bufferData]).toString();

          const strBody = requestBody.replaceAll('\r', '').split('\n');

          for (let item of strBody) {
            if (item.includes('secret')) {
              secret = strBody[strBody.indexOf(item) + 2];
            }
          }
        }

        if (!secret) {
          throw new BadRequestException('Параметр secret обязателен');
        }
      }

      if (secret !== process.env.SECRET_KEY) {
        throw new UnauthorizedException({
          message: 'Неверный секретный ключ',
        });
      }

      return true;
    } catch (e) {
      throw new UnauthorizedException({
        message: 'Неверный секретный ключ',
      });
    }
  }
}
