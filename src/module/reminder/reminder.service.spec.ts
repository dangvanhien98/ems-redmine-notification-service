import { IClientResponse } from './../../common/providers/mysql/mysql.service.i';
import { HttpService } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { MessageErrorConstant } from '../../common/constants/messageErrorConstant';
import { MySqlConfig } from '../../common/environment/mysql';
import { MySQLError } from '../../common/providers/mysql/client';
import {
  clientMock,
  MySqlServiceMock,
} from '../../common/providers/mysql/mysql.mock';
import { MySqlService } from '../../common/providers/mysql/mysql.service';
import { IClient } from '../../common/providers/mysql/mysql.service.i';
import { ConfigService } from '../config';
import { ConfigServiceMock } from '../config/config.mock';
import { SocketServerClientService } from '../socket-server-client/socket-server-client.service';
import {
  HttpServiceMock,
  SocketServerClientServiceMock,
} from './reminder.mock';
import { AddReminder, Reminder, Users } from './reminder.model.i';
import { ReminderService } from './reminder.service';
import { ERROR } from 'bunyan';
describe('ReminderService', () => {
  let service: ReminderService;

  let mySqlService: MySqlService;
  let configService: ConfigService;
  let socketService: SocketServerClientService;
  let httpService: HttpService;
  const addReminder: AddReminder = {
    reminderId: 10,
    eventType: 'category name',
    eventId: 5,
    eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
    eventTitle: 'test',
    eventDescription: 'test',
    eventViewPath: 'test',
    reminders: [
      {
        userId: 1,
        userName: 'test',
      },
    ],
  };
  const reminder: Reminder = {
    reminderId: 1,
    notificationUrl: 'test',
    eventType: 1,
    eventId: 2,
    eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
    eventTitle: 'test',
    eventDescription: 'test',
    eventViewPath: 'test',
    reminders: '1;thi,2;nghia',
    expireDate: new Date('2020-12-24T08:25:04.810Z'),
    repeatType: 'test',
    eventTypeId: 1,
    repeatValue: 'test',
  };
  const reminderUndefine: Reminder = {
    reminderId: 1,
    notificationUrl: 'test',
    eventType: 1,
    eventId: 2,
    eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
    eventTitle: 'test',
    eventDescription: 'test',
    eventViewPath: 'test',
    reminders: undefined,
    expireDate: new Date('2020-12-24T08:25:04.810Z'),
    repeatType: 'test',
    eventTypeId: 1,
    repeatValue: 'test',
  };
  const response: any = {
    notificationId: 2,
  };
  const userIds: Number[] = [1, 2];
  const dataNotification = {
    title: reminder.eventTitle,
    description: reminder.eventDescription,
    timeNotification: new Date('2020-11-24T08:25:04.810Z'),
    eventId: reminder.eventId,
    eventPath: reminder.eventViewPath,
    userIds: userIds,
    eventStartTime: reminder.eventStartTime,
    eventTypeId: reminder.eventTypeId,
  };
  const users: Users[] = [
    {
      userId: 1,
      userName: 'test1',
    },
    {
      userId: 2,
      userName: 'test2',
    },
  ];
  const clientResponse: any = MessageErrorConstant.ADD_SUCCESS;
  const reminderResponse: IClientResponse<Reminder> = {
    count: 1,
    records: [
      {
        reminderId: 1,
        notificationUrl: 'test',
        eventType: 1,
        eventTypeId: 1,
        eventId: 2,
        eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
        eventTitle: 'test',
        eventDescription: 'test',
        beforeMinute: 720,
        isRepeat: 0,
        expireDate: new Date('2020-12-24T08:25:04.810Z'),
        repeatType: 'normal',
        repeatValue: 'test',
        eventViewPath: 'test',
        reminders: '1;thi,2;nghia',
      },
    ],
  };
  const reminderResponseUndefine: IClientResponse<Reminder> = {
    count: 1,
    records: [
      {
        reminderId: 1,
        notificationUrl: 'test',
        eventType: 1,
        eventTypeId: 1,
        eventId: 2,
        eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
        eventTitle: 'test',
        eventDescription: 'test',
        beforeMinute: 720,
        isRepeat: 0,
        expireDate: new Date('2020-12-24T08:25:04.810Z'),
        repeatType: 'normal',
        repeatValue: 'test',
        eventViewPath: 'test',
        reminders: undefined,
      },
    ],
  };
  const reminderResponseEmpty: IClientResponse<Reminder> = {
    count: 0,
    records: [],
  };
  const mySqlConfig = {} as MySqlConfig;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReminderService,
        { provide: MySqlService, useClass: MySqlServiceMock },
        { provide: ConfigService, useClass: ConfigServiceMock },
        {
          provide: SocketServerClientService,
          useClass: SocketServerClientServiceMock,
        },
        { provide: HttpService, useClass: HttpServiceMock },
      ],
    }).compile();

    service = module.get<ReminderService>(ReminderService);
    mySqlService = module.get<MySqlService>(MySqlService);
    configService = module.get<ConfigService>(ConfigService);
    socketService = module.get<SocketServerClientService>(
      SocketServerClientService,
    );
    httpService = module.get<HttpService>(HttpService);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mySqlService).toBeDefined();
    expect(configService).toBeDefined();
    expect(socketService).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe(ReminderService.prototype.addNewReminder$.name, () => {
    /**Mock client */
    let client: IClient;
    beforeEach(() => {
      client = clientMock;
      jest.spyOn(configService, 'mySqlConfig').mockReturnValue(mySqlConfig);
      jest.spyOn(mySqlService, 'getClient$').mockReturnValue(of(client));
      jest
        .spyOn(mySqlService, 'controlTransaction$')
        .mockImplementation((a, b) => b(client));
    });
    /** Test all case
     * 1. controlTransaction$, client.query$ to have called
     * 2. should return success
     * 3. should return success when have expireDate
     * 4. should return error 500
     */
    it('should call controlTransaction$, query$', done => {
      // arrange
      jest.spyOn(client, 'query$').mockReturnValue(throwError(new Error()));
      // act
      return service
        .addNewReminder$(addReminder)
        .toPromise()
        .then(() => {
          fail('Not expected here');
          done();
        })
        .catch(err => {
          expect(configService.mySqlConfig).toHaveBeenCalled();
          expect(mySqlService.controlTransaction$).toHaveBeenCalled();
          expect(client.query$).toHaveBeenCalled();
          done();
        });
    });
    it('should return success', done => {
      // arrange
      jest.spyOn(client, 'query$').mockReturnValue(of(clientResponse));
      const expected = clientResponse;
      // act
      return service
        .addNewReminder$(addReminder)
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail('Not expected here');
          done();
        });
    });
    it('should return success  when have expireDate', done => {
      // arrange
      jest.spyOn(client, 'query$').mockReturnValue(of(clientResponse));
      const expected = clientResponse;
      // act
      return service
        .addNewReminder$({ ...addReminder, expireDate: new Date() })
        .toPromise()
        .then(data => {
          // expect(data.expireDate).toBeFalsy();
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    it('should return 500 err', done => {
      // arrange
      const error = new Error();
      jest.spyOn(client, 'query$').mockReturnValue(throwError(error));
      const expected = new MySQLError(500, `Unexpected error`, error);
      // act
      return service
        .addNewReminder$(addReminder)
        .toPromise()
        .then(() => {
          fail('Not expected here');
          done();
        })
        .catch(err => {
          expect(err).toBeInstanceOf(MySQLError);
          expect(err).toEqual(expected);
          done();
        });
    });
  });
  describe(ReminderService.prototype.createNotification.name, () => {
    /**Mock client */

    beforeEach(() => {
      jest.spyOn(httpService, 'post').mockReturnValue(of(response));
    });
    /** Test all case
     * 1. should return success
     * 1. should success reminders undefine
     * 2. should return success when reminders empty
     */
    it('should success', done => {
      // arrange
      const expected: any = [{ ...response }, { ...dataNotification }];
      // act
      return service
        .createNotification(reminder)
        .toPromise()
        .then(data => {
          expect(data.title).toEqual(expected.title);
          expect(data.description).toEqual(expected.description);
          expect(data.eventId).toEqual(expected.eventId);
          expect(data.eventPath).toEqual(expected.eventPath);
          expect(data.userIds).toEqual(expected.userIds);
          expect(data.eventStartTime).toEqual(expected.eventStartTime);
          expect(data.eventTypeId).toEqual(expected.eventTypeId);
          expect(data.notificationId).toEqual(expected.notificationId);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    it('should success reminders undefine', done => {
      // arrange
      const expected: any = [{ ...response }, { ...dataNotification }];
      // act
      return service
        .createNotification(reminderUndefine)
        .toPromise()
        .then(data => {
          expect(data.title).toEqual(expected.title);
          expect(data.description).toEqual(expected.description);
          expect(data.eventId).toEqual(expected.eventId);
          expect(data.eventPath).toEqual(expected.eventPath);
          expect(data.userIds).toEqual(expected.userIds);
          expect(data.eventStartTime).toEqual(expected.eventStartTime);
          expect(data.eventTypeId).toEqual(expected.eventTypeId);
          expect(data.notificationId).toEqual(expected.notificationId);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    it('should success when reminders empty', done => {
      // arrange
      const expected: any = [
        { ...response },
        { ...dataNotification, userIds: [] },
      ];
      // act
      return service
        .createNotification({ ...reminder, reminders: '' })
        .toPromise()
        .then(data => {
          expect(data.title).toEqual(expected.title);
          expect(data.description).toEqual(expected.description);
          expect(data.eventId).toEqual(expected.eventId);
          expect(data.eventPath).toEqual(expected.eventPath);
          expect(data.userIds).toEqual(expected.userIds);
          expect(data.eventStartTime).toEqual(expected.eventStartTime);
          expect(data.eventTypeId).toEqual(expected.eventTypeId);
          expect(data.notificationId).toEqual(expected.notificationId);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    it('should return post fail', done => {
      const error = new Error();
      jest.spyOn(httpService, 'post').mockReturnValue(throwError(error));
      // arrange
      const expected = error;
      // act
      return service
        .createNotification({ ...reminder, reminders: '' })
        .toPromise()
        .then(() => {
          fail("not expected here");
          done();
        })
        .catch(err => {
          // expect(err).toBeInstanceOf(MySQLError);
          expect(err).toEqual(expected);
          done();
        });
    });
  });
  describe(ReminderService.prototype.convertUsersDataToString.name, () => {
    /**Mock client */
    beforeEach(() => {});
    /** Test all case
     * 1.return success
     */
    it('should success', () => {
      // arrange
      const expected = '1;test1,2;test2';
      // act
      const value = service.convertUsersDataToString(users);
      expect(value).toEqual(expected);
    });
  });
  describe(ReminderService.prototype.updateDate.name, () => {
    /**Mock client */
    beforeEach(() => {});
    /** Test all case
     * 1.should success default
     * 2.should success with everyday
     * 3.should success with weekly
     * 4.should success with monthly
     * 5.should success with monthly lastmonth
     * 6.should success with monthly with startTime else endTime
     */
    it('should success default', () => {
      // arrange
      const expected = null;
      // act
      const value = service.updateDate(reminder);
      expect(value).toEqual(expected);
    });
    it('should success with everyday', () => {
      // arrange
      const expected = '2020-11-25 08:25:04';
      // act
      const value = service.updateDate({ ...reminder, repeatType: 'everyday' });
      expect(value).toEqual(expected);
    });
    it('should success with weekly', () => {
      // arrange
      const expected = '2020-12-01 08:25:04';
      // act
      const value = service.updateDate({ ...reminder, repeatType: 'weekly' });
      expect(value).toEqual(expected);
    });
    it('should success with monthly', () => {
      // arrange
      const expected = '2020-12-24 08:25:04';
      // act
      const value = service.updateDate({ ...reminder, repeatType: 'monthly' });
      expect(value).toEqual(expected);
    });
    it('should success monthly with value lastmonth', () => {
      // arrange
      const expected = '2020-12-31 23:59:59';
      // act
      const value = service.updateDate({
        ...reminder,
        repeatType: 'monthly',
        repeatValue: 'lastmonth',
      });
      expect(value).toEqual(expected);
    });
    it('should success monthly with startTime else endTime', () => {
      // arrange
      const expected = '2020-03-31 08:25:04';
      // act
      const value = service.updateDate({
        ...reminder,
        eventStartTime: new Date('2020-01-31T08:25:04.810Z'),
        repeatType: 'monthly',
      });
      expect(value).toEqual(expected);
    });
  });
  
  // describe(ReminderService.prototype.convertDataToReminder.name, () => {
  //   /**Mock client */
  //   beforeEach(() => {});
  //   /** Test all case
  //    * 1.return success
  //    * 2.should success with reminder empty
  //    */
  //   it('should success ', () => {
  //     // arrange
  //     const expected = {
  //       ...reminder,
  //       reminders: [
  //         {
  //           userId: '1',
  //           userName: 'thi',
  //         },
  //         {
  //           userId: '2',
  //           userName: 'nghia',
  //         },
  //       ],
  //     };
  //     // act
  //     const value = service.convertDataToReminder(reminder);
  //     expect(value).toEqual(expected);
  //   });
  //   it('should success with reminder empty', () => {
  //     // arrange
  //     const expected = {
  //       ...reminder,
  //       reminders: [
  //         {
  //           userId: '',
  //           userName: undefined,
  //         },
  //       ],
  //     };
  //     // act
  //     const value = service.convertDataToReminder({
  //       ...reminder,
  //       reminders: '',
  //     });
  //     expect(value).toEqual(expected);
  //   });
  // });
  describe(ReminderService.prototype.sqlReminder.name, () => {
    /**Mock client */
    beforeEach(() => {});
    /** Test all case
     * 1.return success
     * 2.should success with updateDate empty
     * 3.should success with evenStartTome isAfter expireDate
     * 4.should success with evenStartTome isAfter expireDate and empty
     */
    it('should success ', () => {
      // arrange
      jest.spyOn(service, 'updateDate').mockReturnValue('2020-12-01 08:25:04');
      const expected = `UPDATE ems_reminder.reminder re
        SET re.event_start_time = '2020-12-01 08:25:04'
        WHERE re.reminder_id = 1;`;
      // act
      const value = service.sqlReminder(reminder);
      expect(value).toEqual(expected);
    });
    it('should success with updateDate empty ', () => {
      // arrange
      jest.spyOn(service, 'updateDate').mockReturnValue('');
      const expected = '';
      // act
      const value = service.sqlReminder(reminder);
      expect(value).toEqual(expected);
    });
    it('should success with evenStartTome isAfter expireDate ', () => {
      // arrange
      jest.spyOn(service, 'updateDate').mockReturnValue('2020-12-24 08:25:04');
      const expected = `DELETE FROM ems_reminder.reminder re
        WHERE re.reminder_id = 1;`;
      // act
      const value = service.sqlReminder({
        ...reminder,
        expireDate: new Date('2020-10-24T08:25:04.810Z'),
      });
      expect(value).toEqual(expected);
    });
    it('should success with evenStartTome isAfter expireDate and empty', () => {
      // arrange
      jest.spyOn(service, 'updateDate').mockReturnValue('');
      const expected = '';
      // act
      const value = service.sqlReminder({
        ...reminder,
        expireDate: new Date('2020-10-24T08:25:04.810Z'),
      });
      expect(value).toEqual(expected);
    });
  });
  describe(ReminderService.prototype.updateOrDeleteReminder.name, () => {
    /**Mock client */
    let client: IClient;
    const success: any = { message: 'Success !!' };
    beforeEach(() => {
      client = clientMock;
      jest.spyOn(configService, 'mySqlConfig').mockReturnValue(mySqlConfig);
      jest.spyOn(mySqlService, 'getClient$').mockReturnValue(of(client));
      jest
        .spyOn(mySqlService, 'controlTransaction$')
        .mockImplementation((a, b) => b(client));
      const valueSql = `UPDATE ems_reminder.reminder re
        SET re.event_start_time = '2020-12-01 08:25:04'
        WHERE re.reminder_id = 1;`;

      jest.spyOn(service, 'sqlReminder').mockReturnValue(valueSql);
    });

    /** Test all case
     * 1.should call controlTransaction$, query$
     * 1.return success
     * 1.should return 500 err
     */
    it('should call controlTransaction$, query$', done => {
      // arrange
      const error = new Error();
      jest.spyOn(client, 'query$').mockReturnValue(throwError(error));
      const expected = new MySQLError(500, `Unexpected error`, error);
      // act
      return service
        .updateOrDeleteReminder(reminder)
        .toPromise()
        .then(() => {
          fail('Not expected here');
          done();
        })
        .catch(err => {
          expect(configService.mySqlConfig).toHaveBeenCalled();
          expect(mySqlService.controlTransaction$).toHaveBeenCalled();
          expect(client.query$).toHaveBeenCalled();
          done();
        });
    });
    it('should return success', done => {
      // arrange

      jest.spyOn(client, 'query$').mockReturnValue(of(success));
      const expected = success;
      // act
      return service
        .updateOrDeleteReminder(reminder)
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail('Not expected here');
          done();
        });
    });

    it('should return 500 err', done => {
      // arrange
      const error = new Error();
      jest.spyOn(client, 'query$').mockReturnValue(throwError(error));
      const expected = new MySQLError(500, `Unexpected error`, error);
      // act
      return service
        .updateOrDeleteReminder(reminder)
        .toPromise()
        .then(() => {
          fail('Not expected here');
          done();
        })
        .catch(err => {
          expect(err).toBeInstanceOf(MySQLError);
          expect(err).toEqual(expected);
          done();
        });
    });
  });
  describe(ReminderService.prototype.getReminderList$.name, () => {
    /**Mock client */
    const reminderResponse1: IClientResponse<Reminder> = {
      count: 1,
      records: [
        {
          reminderId: 1,
          notificationUrl: 'test',
          eventType: 1,
          eventTypeId: 1,
          eventId: 2,
          eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
          eventTitle: 'test',
          eventDescription: 'test',
          beforeMinute: 720,
          isRepeat: 1,
          expireDate: new Date('2020-12-24T08:25:04.810Z'),
          repeatType: 'normal',
          repeatValue: 'test',
          eventViewPath: 'test',
          reminders: '',
        },
      ],
    };
    const reminderResponse2: IClientResponse<Reminder> = {
      count: 1,
      records: [
        {
          reminderId: 1,
          notificationUrl: 'test',
          eventType: 1,
          eventTypeId: 1,
          eventId: 2,
          eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
          eventTitle: 'test',
          eventDescription: 'test',
          beforeMinute: 720,
          isRepeat: 1,
          expireDate: new Date('2020-12-24T08:25:04.810Z'),
          repeatType: 'test',
          repeatValue: 'test',
          eventViewPath: 'test',
          reminders: '1;thi,2;nghia,3;hieu',
        },
      ],
    };
    const reminderResponse2Undefine: IClientResponse<Reminder> = {
      count: 1,
      records: [
        {
          reminderId: 1,
          notificationUrl: 'test',
          eventType: 1,
          eventTypeId: 1,
          eventId: 2,
          eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
          eventTitle: 'test',
          eventDescription: 'test',
          beforeMinute: 720,
          isRepeat: 1,
          expireDate: new Date('2020-12-24T08:25:04.810Z'),
          repeatType: 'test',
          repeatValue: 'test',
          eventViewPath: 'test',
          reminders: undefined,
        },
      ],
    };
    const reminderResponse3: IClientResponse<Reminder> = {
      count: 1,
      records: [
        {
          reminderId: 1,
          notificationUrl: 'test',
          eventType: 1,
          eventTypeId: 1,
          eventId: 2,
          eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
          eventTitle: 'test',
          eventDescription: 'test',
          beforeMinute: 720,
          isRepeat: 1,
          expireDate: new Date('2020-12-24T08:25:04.810Z'),
          repeatType: 'test',
          repeatValue: 'test',
          eventViewPath: 'test',
          reminders: '',
        },
      ],
    };
    let client: IClient;
    beforeEach(() => {
      client = clientMock;
      jest.spyOn(configService, 'mySqlConfig').mockReturnValue(mySqlConfig);
      jest.spyOn(mySqlService, 'getClient$').mockReturnValue(of(client));
      jest
        .spyOn(mySqlService, 'controlTransaction$')
        .mockImplementation((a, b) => b(client));
      jest
        .spyOn(service, 'createNotification')
        .mockReturnValue(of([{ ...response }, { ...dataNotification }]));
      jest.spyOn(socketService, 'sendDataReminder').mockReturnValue();
    });
    /** Test all case
     * 1. controlTransaction$, client.query$ to have called
     * 2. 'should return success isRepeat = 0 with notificationId
     * 3. should return success isRepeat = 0 with notificationId and reminders undefine
     * 4. should return success isRepeat = 0 without notificationId
     * 5. should return record throw error
     * 6. should return success repeatType normal
     * 7. should return success repeatType normal without notificationId
     * 8. should return success else isRepeat =0 and normal
     * 9. should return success else isRepeat =0 and normal, without notificationId
     * 10. should return success else isRepeat =0 and normal, reminders undefine
     * 11. should return success else isRepeat =0 and normal, without reminders
     * 12. should return error 500
     */
    it('should call controlTransaction$, query$', done => {
      // arrange
      jest.spyOn(client, 'query$').mockReturnValue(throwError(new Error()));
      // act
      return service
        .addNewReminder$(addReminder)
        .toPromise()
        .then(() => {
          fail('Not expected here');
          done();
        })
        .catch(err => {
          expect(configService.mySqlConfig).toHaveBeenCalled();
          expect(mySqlService.controlTransaction$).toHaveBeenCalled();
          expect(client.query$).toHaveBeenCalled();
          done();
        });
    });

    it('should return success isRepeat = 0 with notificationId', done => {
      // arrange
      jest.spyOn(client, 'query$').mockReturnValue(of({ ...reminderResponse }));
      const expected = [reminderResponse];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });

    it('should return success isRepeat = 0 with notificationId and reminders undefine', done => {
      // arrange
      jest.spyOn(client, 'query$').mockReturnValue(of({ ...reminderResponseUndefine }));
      const expected = [reminderResponseUndefine];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    
    it('should return success isRepeat = 0 without notificationId', done => {
      // arrange
      jest.spyOn(client, 'query$').mockReturnValue(of({ ...reminderResponse }));
      jest.spyOn(service, 'createNotification').mockReturnValue(of([]));
      const expected = [reminderResponse];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });

    it('should return record throw error', done => {
      // arrange
      jest.spyOn(client, 'query$').mockReturnValue(of({} as any));
      jest.spyOn(service, 'createNotification').mockReturnValue(throwError( new Error()));
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          fail('not expect here');
          done();
        })
        .catch(err => {
          expect(client.query$).toHaveBeenCalled();
          done();
        });
    });

    it('should return success repeatType normal', done => {
      jest
        .spyOn(client, 'query$')
        .mockReturnValue(of({ ...reminderResponse1 }));
      const expected = [reminderResponse1];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    
    it('should return success repeatType normal without notificationId', done => {
      jest
        .spyOn(client, 'query$')
        .mockReturnValue(of({ ...reminderResponse1 }));
      jest.spyOn(service, 'createNotification').mockReturnValue(of([]));
      const expected = [reminderResponse1];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    
    it('should return success else isRepeat =0 and normal', done => {
      // mock
      // arrange
      jest
        .spyOn(client, 'query$')
        .mockReturnValue(of({ ...reminderResponse2 }));
      const expected = [reminderResponse2];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    
    it('should return success else isRepeat =0 and normal, without notificationId', done => {
      // mock
      // arrange
      jest
        .spyOn(client, 'query$')
        .mockReturnValue(of({ ...reminderResponse2 }));
      jest.spyOn(service, 'createNotification').mockReturnValue(of([]));
      const expected = [reminderResponse2];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    
    it('should return success else isRepeat =0 and normal, reminders undefine', done => {
      // mock
      // arrange
      jest
        .spyOn(client, 'query$')
        .mockReturnValue(of({ ...reminderResponse2Undefine }));
      const expected = [reminderResponse2Undefine];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    
    it('should return success else isRepeat =0 and normal, without reminders', done => {
      // mock
      // arrange
      jest
        .spyOn(client, 'query$')
        .mockReturnValue(of({ ...reminderResponse3 }));
      const expected = [reminderResponse3];
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(data => {
          expect(data).toEqual(expected);
          done();
        })
        .catch(err => {
          fail(err);
          done();
        });
    });
    
    it('should return 500 err', done => {
      // arrange
      const error = new Error();
      jest.spyOn(client, 'query$').mockReturnValue(throwError(error));
      const expected = new MySQLError(500, `Unexpected error`, error);
      // act
      return service
        .getReminderList$()
        .toPromise()
        .then(() => {
          fail('Not expected here');
          done();
        })
        .catch(err => {
          expect(err).toBeInstanceOf(MySQLError);
          expect(err).toEqual(expected);
          done();
        });
    });
  });
});
