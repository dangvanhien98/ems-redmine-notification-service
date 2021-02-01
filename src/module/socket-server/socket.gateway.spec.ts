import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { throwError } from 'rxjs';
import { Socket, Server } from 'socket.io';
import { SocketGateway } from './socket.gateway';

describe('SockerGateway', () => {
  let service: SocketGateway;
  let app: INestApplication;

  let user: string[] = ['2', '3'];

  let client: Socket = {
    id: '11111111',
    transports: ['polling', 'websocket'],
    handshake: {
      query: {
        token: 'token',
        username: 'userName',
        userId: '2',
      },
    },
  };

  let client2: Socket = {
    id: '11111111',
    transports: ['polling', 'websocket'],
    handshake: {
      query: {
        token: 'token',
        username: 'userName',
        userId: '1',
      },
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketGateway],
    }).compile();
    app = module.createNestApplication();
    app.init();
    service = module.get<SocketGateway>(SocketGateway);
  });

  afterEach(async () => {
    await app.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(SocketGateway.prototype.handleConnection.name, () => {
    it('connect', done => {
      let expected = service.user + 1;
      service.handleConnection(client);
      expect(service.user).toEqual(expected);
      done();
    });
  });

  describe(SocketGateway.prototype.authenticationSocket.name, () => {
    it('authentication', done => {
      try {
        service.authenticationSocket();
        done();
      } catch (error) {
        fail('Not expect here');
      }
    });
  });

  describe(SocketGateway.prototype.getDataNotification.name, () => {
    let dataReminder = {
      notificationId: 1,
      userIds: [1, 2, 3],
      Id: 1,
      eventId: 2,
      notificationTitle: 'title',
      categoryName: 'metting',
      notificationDescription: 'review code',
      time_reminder: '14:00 - 16:00',
      status: 1,
      created: '1',
      modified: '1',
    };
    it('should emit to client when userId exist in listUserSocketId', done => {
      let mockClient = {
        emit: service.server.to(client).emit = jest.fn(),
      };
      service.handleConnection(client);
      service.handleConnection(client2);
      service.getDataNotification(dataReminder);
      expect(mockClient.emit).toHaveBeenCalledWith(
        'setPopUpNotification',
        dataReminder,
      );
      done();
    });

    it("shouldn't emit to client when userIds is empty", done => {
      let mockClient = {
        emit: service.server.to(client).emit = jest.fn(),
      };
      service.handleConnection(client);
      service.handleConnection(client2);
      service.getDataNotification({ ...dataReminder, userIds: [] });
      expect(mockClient.emit.mock.calls.length).toBe(0);
      done();
    });

    it("shouldn't emit to client when userId doesn't exist in listUserSocketId", done => {
      let mockClient = {
        emit: service.server.to(client).emit = jest.fn(),
      };
      service.handleConnection(client);
      service.handleConnection(client2);
      service.getDataNotification({ ...dataReminder, userIds: [22, 23] });
      expect(mockClient.emit.mock.calls.length).toBe(0);
      done();
    });
  });

  describe(SocketGateway.prototype.getNotification.name, () => {
    it('should emit to client when user exist in listUserSocketId', done => {
      let mockClient = {
        emit: service.server.to(client).emit = jest.fn(),
      };
      service.handleConnection(client);
      service.handleConnection(client2);
      service.getNotification(user);
      expect(mockClient.emit).toHaveBeenCalledWith(
        'getNotification',
        'Notification for Schedule ',
      );
      done();
    });

    it("shouldn't emit to client when user is empty", done => {
      let mockClient = {
        emit: service.server.to(client).emit = jest.fn(),
      };
      service.handleConnection(client);
      service.handleConnection(client2);
      service.getNotification([]);
      expect(mockClient.emit.mock.calls.length).toBe(0);
      done();
    });

    it("shouldn't emit to client when user doesn't exist in listUserSocketId", done => {
      let mockClient = {
        emit: service.server.to(client).emit = jest.fn(),
      };
      service.handleConnection(client);
      service.handleConnection(client2);
      service.getNotification(['22', '33']);
      expect(mockClient.emit.mock.calls.length).toBe(0);
      done();
    });
  });

  describe(SocketGateway.prototype.handleDisconnect.name, () => {
    it('disconnect', done => {
      const expected = service.user - 1;
      service.handleDisconnect(client);
      expect(service.user).toEqual(expected);
      done();
    });
  });
});
