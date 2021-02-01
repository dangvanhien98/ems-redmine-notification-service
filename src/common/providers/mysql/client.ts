import { Observable, of, throwError, from, bindNodeCallback } from 'rxjs';
import { tap, mergeMap, map, catchError } from 'rxjs/operators';

import { IClient, IClientResponse } from './mysql.service.i';
import { PoolConnection, QueryOptions } from 'mysql';

// TODO :: change console.log to logger if have

/**
 * Handle for mysql PoolConnection
 * Customize mysql PoolConnection use Observable
 * @param client : PoolConnection with connected to DB
 */
export class Client implements IClient {
  constructor(private client: PoolConnection) {}

  /** Convert mysql function to Observable */
  public beginTransaction$(option?: QueryOptions): Observable<any> {
    return new Observable<any>(o => {
      this.client.beginTransaction(option, err => {
        if (err) {
          o.error(err);
        } else {
          o.next(undefined);
        }
        o.complete();
      });
    });
  }
  public commit$(option?: QueryOptions): Observable<any> {
    return new Observable<any>(o => {
      this.client.commit(option, err => {
        if (err) {
          o.error(err);
        } else {
          o.next(undefined);
        }
        o.complete();
      });
    });
  }
  public rollback$(option?: QueryOptions): Observable<any> {
    return new Observable<any>(o => {
      this.client.rollback(option, err => {
        if (err) {
          o.error(err);
        } else {
          o.next(undefined);
        }
        o.complete();
      });
    });
  }
  public connect$(option?: any): Observable<any> {
    return new Observable<any>(o => {
      this.client.connect(option, err => {
        if (err) {
          o.error(err);
        } else {
          o.next(undefined);
        }
        o.complete();
      });
    });
  }
  public mySqlQuery$(sql: string, queryParams: any[] = []): Observable<any> {
    return new Observable<any>(o => {
      this.client.query(sql, queryParams, (err, result, field) => {
        if (err) {
          o.error(err);
        } else {
          o.next(result);
        }
        o.complete();
      });
    });
  }
  public query$<T>(
    sql: string,
    queryParams: any[] = [],
  ): Observable<IClientResponse<T>> {
    console.log(
      sql
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    );
    return of(
      sql
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .replace(/\s+/g, ' ')
        .trim(),
    ).pipe(
      tap(query =>
        console.log('MySQL: Trying to access to the database', { query }),
      ),
      mergeMap(query =>
        this.mySqlQuery$(query, queryParams).pipe(map(data => data)),
      ),
      tap(res =>
        console.log('MySQL: Got response from database', {
          rowCount: (res && res.length) || 0,
        }),
      ),
      map(res => ({
        count: (res && res.length) || 0,
        records: (res && JSON.parse(JSON.stringify(res))) || ([] as T[]),
      })),
      catchError(error => {
        console.log('MySQL: Failed to query', { error });
        return throwError(ErrorCode.categorize(error));
      }),
    );
  }

  public disconnect(): void {
    //this.client.end(err => console.log('MySQL: Failed to disconnect', { err }));
    this.client.destroy();
  }
}

export class MySQLError implements Error {
  public readonly name = MySQLError.name;
  constructor(
    public code: number,
    public message: string,
    public originalError?: any,
  ) {}

  public toString(): string {
    return `${this.name}: ${this.code} ${this.message}`;
  }
}

export class ErrorCode {
  public static readonly BAD_REQUEST = 400;
  public static readonly FORBIDDEN = 403;
  public static readonly NOT_FOUND = 404;
  public static readonly CONFLICT = 409;
  public static readonly INTERNAL = 500;

  public static categorize(err: any) {
    if (err instanceof MySQLError) {
      return err;
    }

    switch (true) {
      case /^23505.*$/i.test(err.code):
        return new MySQLError(this.CONFLICT, 'Already registered', err);
      case /^23.*$/i.test(err.code):
        return new MySQLError(this.BAD_REQUEST, 'Constraint violation', err);
      case /^22.*$/i.test(err.code):
        return new MySQLError(this.BAD_REQUEST, 'Invalid parameters', err);
    }
    return new MySQLError(this.INTERNAL, `Unexpected error`, err);
  }
}
