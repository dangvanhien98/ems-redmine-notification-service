import { Test, TestingModule } from '@nestjs/testing';
import { ReminderGuard } from './reminder.controller.guard';

describe('CategoryControllerGuard', () => {
  /** Khai báo Class thực hiện Unit test */
  let guard: ReminderGuard;

  /** Khởi tạo với mỗi spec */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderGuard],
    }).compile();
    guard = module.get<ReminderGuard>(ReminderGuard);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  /** Test defined all service */
  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe(ReminderGuard.prototype.isPostBody.name, () => {
    /** All spec for isGetCategoryListParams */
    const specs = [

      {
        title: 'should return false when undefined',
        input: undefined,
        expected: false,
      },
      {
        title: 'should return false when data not correct',
        input: null,
        expected: false,
      },
      {
        title: 'return false when data items is not object',
        input: '',
        expected: false,
      },
      // Check required
      // eventId
      {
        title: 'should return false when eventId is not connect ',
        input: {
          eventId: 'test',
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when eventId is not connect ',
        input: {
          eventId: 1.2,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when eventId is not exits ',
        input: {
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return true eventId',
        input: {
          eventId: 2,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: true,
      },
      // notificationUrl
      {
        title: 'should return false when notificationUrl is not connect ',
        input: {
          eventId: 1,
          notificationUrl: '',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when notificationUrl is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 12,
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when notificationUrl is not exits ',
        input: {
          eventId: 1,
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return true notificationUrl',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: true,
      },
      // eventTitle
      {
        title: 'should return false when eventTitle is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: '',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when eventTitle is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 16,
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when eventTitle is not exits ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return true eventTitle',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: true,
      },
      // eventDescription
      {
        title: 'should return false when eventDescription is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 16,
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when eventDescription is not exits ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return true eventDescription',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: true,
      },
      // eventViewPath
      {
        title: 'should return false when eventViewPath is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: '',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when eventViewPath is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 16,
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when eventViewPath is not exits ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return true eventViewPath',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: true,
      },
      // eventStartTime
      {
        title: 'should return false when eventStartTime is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: 'test',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return false when eventStartTime is not exits ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: false,
      },
      {
        title: 'should return true eventStartTime',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: true,
      },
      // reminders
      {
        title: 'should return false when reminders is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: '',
        },
        expected: false,
      },
      {
        title: 'should return false when reminders is not exits ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
        },
        expected: false,
      },
      {
        title: 'should return true reminders',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
        },
        expected: true,
      },
      //End check required
      // eventType
      {
        title: 'should return false when eventType is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          eventType: '',
        },
        expected: false,
      },
      {
        title: 'should return false when eventType is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          eventType: 16,
        },
        expected: false,
      },
      {
        title: 'should return true eventType',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          eventType: 'test',
        },
        expected: true,
      },
      // eventTypeId
      {
        title: 'should return false when eventTypeId is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          eventTypeId: '',
        },
        expected: false,
      },
      {
        title: 'should return false when eventTypeId is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          eventTypeId: 16.6,
        },
        expected: false,
      },
      {
        title: 'should return true eventTypeId',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          eventTypeId: 16,
        },
        expected: true,
      },
      // beforeMinute
      {
        title: 'should return false when beforeMinute is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          beforeMinute: '',
        },
        expected: false,
      },
      {
        title: 'should return false when beforeMinute is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          beforeMinute: 16.6,
        },
        expected: false,
      },
      {
        title: 'should return true beforeMinute',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          beforeMinute: 16,
        },
        expected: true,
      },
      // isRepeat
      {
        title: 'should return false when isRepeat is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          isRepeat: '',
        },
        expected: false,
      },
      {
        title: 'should return false when isRepeat is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          isRepeat: 16.6,
        },
        expected: false,
      },
      {
        title: 'should return true isRepeat',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          isRepeat: true,
        },
        expected: true,
      },
      // expireDate
      {
        title: 'should return false when expireDate is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          expireDate: 'test',
        },
        expected: false,
      },
      {
        title: 'should return true expireDate',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          expireDate: '2020-11-11T01:27:52.000Z',
        },
        expected: true,
      },
      // repeatType
      {
        title: 'should return false when repeatType is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          repeatType: '',
        },
        expected: false,
      },
      {
        title: 'should return false when repeatType is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          repeatType: 16.6,
        },
        expected: false,
      },
      {
        title: 'should return true repeatType',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          repeatType: 'test',
        },
        expected: true,
      },
      // repeatValue
      {
        title: 'should return false when repeatValue is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          repeatValue: '',
        },
        expected: false,
      },
      {
        title: 'should return false when repeatValue is not connect ',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          repeatValue: 16.6,
        },
        expected: false,
      },
      {
        title: 'should return true repeatValue',
        input: {
          eventId: 1,
          notificationUrl: 'test',
          eventStartTime: '2020-11-11T01:27:52.000Z',
          eventTitle: 'test',
          eventDescription: 'test',
          eventViewPath: 'test',
          reminders: [{ userId: 1, userName: 'test' }],
          repeatValue: 'test',
        },
        expected: true,
      },
    ];

    /** Excute test */
    specs.forEach(spec => {
      it(spec.title, () => {
        const actual = guard.isPostBody(spec.input);
        // assert
        expect(actual).toEqual(spec.expected);
      });
    });
  });
});
