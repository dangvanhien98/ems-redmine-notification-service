/** All of @Injectable must create mock for jest */
export class ReminderServiceMock{
  public addNewReminder$ = jest.fn();
  public getReminderList$ = jest.fn();
}
export class HttpServiceMock {
  public post = jest.fn();
}
export class SocketServerClientServiceMock {
  public sendDataReminder = jest.fn();
}
export class ReminderGuardMock{
  public isPostBody = jest.fn();
}
