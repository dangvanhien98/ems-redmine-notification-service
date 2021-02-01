import {
  CanActivate,
  ExecutionContext,
  HttpException,
  Injectable,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Socket } from 'socket.io';
import { env } from './../constants/api.constant';
@Injectable()
export class WsGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const client: Socket = context.switchToWs().getClient<Socket>();
    const token: string = client.handshake?.query?.token;
    const username: string = client.handshake?.query?.username;
    return of(true).pipe(
      map(() => {
        request.user = jwt.verify(token, env.JWT_SECRET);
        if (username === request.user.userName) {
          return true;
        }
        client.disconnect();
        return false;
      }),
      catchError(err => {
        client.disconnect();
        const message = 'Token error: ' + (err.message || err.name);
        throw new HttpException(message, 412);
      }),
    );
  }
}
