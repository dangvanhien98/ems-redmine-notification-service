import { Test, TestingModule } from '@nestjs/testing';
import { async } from 'rxjs';
import { GetDataReminder } from '../reminder/reminder.model.i';
import { SocketServerClientService } from './socket-server-client.service';

describe('SocketServerClientService', () => {
  let service: SocketServerClientService;
  var dataSend: any = {
    notificationId: 1,
    userIds: [1, 2],
    Id: 1,
    eventId: 1,
    notificationTitle: 'HIền...',
    categoryName: 'Hiền 1',
    notificationDescription: 'nothing',
    time_reminder: '2:20',
    status: 0,
    created: '1/1/2020',
    modified: '1/1/2020',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocketServerClientService],
    }).compile();
    service = module.get<SocketServerClientService>(SocketServerClientService);
  });

  afterEach(() => {
    expect(service).toBeDefined();
    service.socket.disconnect();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(SocketServerClientService.prototype.getDataNotification.name, () => {
    it('should getDataNotification', () => {
      const emit = (service.socket.emit = jest.fn());
      service.getDataNotification(dataSend);
      expect(emit).toHaveBeenCalledWith('getDataNotification', dataSend);
    });
  });

  describe(SocketServerClientService.prototype.sendDataReminder.name, () => {
    it('should sendDataReminder', () => {
      const emit = (service.socket.emit = jest.fn());
      service.sendDataReminder(dataSend);
      expect(emit).toHaveBeenCalledWith('getDataNotification', dataSend);
    });
  });
});
