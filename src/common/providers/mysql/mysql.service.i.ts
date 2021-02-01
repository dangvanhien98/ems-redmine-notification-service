import { Observable } from 'rxjs';

/**
 * Query execution interface
 */
export interface IClient {
  query$<T>(sql: string, queryParams?: any[]): Observable<IClientResponse<T>>;
  // queryByFile$<T>(filepath: string, queryParams?: any[]): Observable<IClientResponse<T>>;
  beginTransaction$(): Observable<void>;
  commit$(): Observable<void>;
  rollback$(): Observable<void>;
  disconnect(): void;
}

export interface IClientResponse<T> {
  count: number;
  records: T[];
}
export interface IPaginationResponse {
  data: any;
  page: number;
  limit: number;
  total: number;
}
