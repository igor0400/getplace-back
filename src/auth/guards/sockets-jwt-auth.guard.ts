import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SocketsJwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    try {
      const authHeader =
        req?.headers?.authorization ?? req?.handshake?.headers?.authorization;
      const bearer = authHeader?.split(' ')[0];
      const token = authHeader?.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        req.error = 'Пользователь не авторизован';
        return true;
      }

      const user = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (e) {
      req.error = 'Пользователь не авторизован';
      return true;
    }
  }
}
