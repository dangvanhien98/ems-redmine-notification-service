import { of } from 'rxjs';
import { MySqlService } from './mysql.service';
import { IClient } from './mysql.service.i';

export const clientMock: IClient = {
  query$: jest.fn(() => of(null)),
  //   queryByFile$: jest.fn(() => of(null)),
  beginTransaction$: jest.fn(() => of(null)),
  commit$: jest.fn(() => of(null)),
  rollback$: jest.fn(() => of(null)),
  disconnect: jest.fn(() => null),
};

export class MySqlServiceMock {
  public getClient$ = jest.fn(() => of(clientMock));
  public controlTransaction$ = jest.fn(
    MySqlService.prototype.controlTransaction$,
  );
  public connect$ = jest.fn(() => of(null));
  public connectPool$ = jest.fn(() => of(null));
}
