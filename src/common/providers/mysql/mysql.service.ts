import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { IClient } from './mysql.service.i';
import { Observable, throwError, of } from 'rxjs';
import { tap, catchError, mergeMap, map, finalize } from 'rxjs/operators';
import { ErrorCode, Client } from './client';
import { Connection, ConnectionConfig, createPool, Pool } from 'mysql';

@Injectable()
export class MySqlService implements OnModuleDestroy {
  private disconnected = false;
  private connection: Connection;
  private connectPool: Pool;
  public onModuleDestroy() {
    if (this.disconnected === true) {
      return;
    }
    this.disconnected = true;
    this.connectPool.end(() => {
      console.error('Mysql stop');
    });
  }

  public constructor() //TODO :: public logger: LoggerService,
  {}

  public getClient$(mySqlConfig: ConnectionConfig): Observable<IClient> {
    this.connectPool = createPool(mySqlConfig);
    return of(1).pipe(
      mergeMap(() =>
        this.connectPool$().pipe(tap(() => console.log('Connected'))),
      ),
      map(connection => new Client(connection)),
    );
  }

  public controlTransaction$<T>(
    mySqlConfig: ConnectionConfig,
    transaction$: (client: IClient) => Observable<T>,
  ): Observable<T> {
    return of(null).pipe(
      mergeMap(() => this.getClient$(mySqlConfig)),
      tap(() => console.log('begin transaction with DB')),
      mergeMap((client: IClient) =>
        client.beginTransaction$().pipe(
          mergeMap(() => transaction$(client)),
          mergeMap(data => client.commit$().pipe(map(() => data))),
          catchError(err =>
            client.rollback$().pipe(mergeMap(() => throwError(err))),
          ),
          finalize(() => client.disconnect()),
        ),
      ),
    );
  }

  public connect$(option?: any): Observable<any> {
    return new Observable<any>(o => {
      this.connection.connect(option, err => {
        if (err) {
          o.error(err);
        } else {
          o.next(undefined);
        }
        o.complete();
      });
    });
  }
  public connectPool$(): Observable<any> {
    return new Observable<any>(o => {
      this.connectPool.getConnection((err, poolConnection) => {
        if (err) {
          poolConnection.release();
          o.error(err);
        } else {
          console.log('connected as id ' + poolConnection.threadId);
          o.next(poolConnection);
        }
        poolConnection.on('error', () => {
          throw err;
          return;
        });
        o.complete();
      });
    });
  }
}
