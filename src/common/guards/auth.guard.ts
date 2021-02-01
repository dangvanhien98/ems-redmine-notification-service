import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { env } from './../constants/api.constant';
@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    request.user = await this.validateToken(request.headers.authorization);
    return true;
  }
  async validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      // Bearer ${token}
      throw new HttpException(env, 412);
    }

    const token = auth.split(' ')[1];
    try {
      const decoded = await jwt.verify(token, env.JWT_SECRET);
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, 412);
    }
  }
}
