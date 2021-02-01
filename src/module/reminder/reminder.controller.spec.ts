import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { of, throwError } from 'rxjs';
import { MessageErrorConstant } from './../../common/constants/messageErrorConstant';
import { IClientResponse } from './../../common/providers/mysql/mysql.service.i';
import { ReminderController } from './reminder.controller';
import { ReminderGuard } from './reminder.controller.guard';
import { ReminderGuardMock, ReminderServiceMock } from './reminder.mock';
import { AddReminder, Reminder } from './reminder.model.i';
import { ReminderService } from './reminder.service';

describe('ReminderController', () => {
  let controller: ReminderController;

  let reminderService: ReminderService;
  let guard: ReminderGuard;

  const addReminder: AddReminder = {
    reminderId: 10,
    eventType: 'category name',
    eventId: 5,
    eventStartTime: new Date('2020-11-24T08:25:04.810Z'),
    eventTitle: 'test',
    eventDescription: 'test',
    eventViewPath: 'test',
    expireDate: new Date('2020-11-23T08:25:04.810Z'),
    reminders: [
      {
        userId: 1,
        userName: 'test',
      },
    ],
  };
  const addReminderSuccess: AddReminder = {
    reminderId: 10,
    eventType: 'category name',
    eventId: 5,
    eventStartTime: new Date('2021-11-24T08:25:04.810Z'),
    eventTitle: 'test',
    eventDescription: 'test',
    eventViewPath: 'test',
    expireDate: new Date('2021-12-23T08:25:04.810Z'),
    reminders: [
      {
        userId: 1,
        userName: 'test',
      },
    ],
    isRepeat: true,
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReminderController,
        {
          provide: ReminderService,
          useClass: ReminderServiceMock,
        },
        {
          provide: ReminderGuard,
          useClass: ReminderGuardMock,
        },
      ],
    }).compile();

    controller = module.get<ReminderController>(ReminderController);
    reminderService = module.get<ReminderService>(ReminderService);
    guard = module.get<ReminderGuard>(ReminderGuard);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(reminderService).toBeDefined();
    expect(guard).toBeDefined();
  });
  describe(ReminderController.prototype.getReminder.name, () => {
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
    beforeEach(async () => {
      jest
        .spyOn(reminderService, 'getReminderList$')
        .mockReturnValue(of([reminderResponse]));
    });
    /** Test all case
     * 1. should return success
     * 2. should return err
     */
    it('should return success ', done => {
      // arrange
      const expected = [reminderResponse];
      // act
      return controller
        .getReminder()
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
    it('should return err', done => {
      // arrange
      const error = new Error();
      jest
        .spyOn(reminderService, 'getReminderList$')
        .mockReturnValue(throwError(error));
      const expected = error;
      // act
      return controller
        .getReminder()
        .toPromise()
        .then(() => {
          fail('not expected here');
          done();
        })
        .catch(err => {
          expect(err).toEqual(error);
          done();
        });
    });
  });
  describe(ReminderController.prototype.addNewReminder$.name, () => {
    beforeEach(async () => {});
    /** Test all case
     * 1. should return error when params in valid with guard
     * 2. should return error when params in valid with eventStartTime > expireDate
     * 3. should return error when params in valid with eventStartTime < new Date()
     * 4. should return success
     */

    it('should return error when params in valid with guard', done => {
      // arrange
      jest.spyOn(guard, 'isPostBody').mockReturnValue(false);
      const expected = new BadRequestException(
        MessageErrorConstant.BAD_REQUEST,
      );
      // act
      return controller
        .addNewReminder$(addReminder)
        .toPromise()
        .then(() => {
          fail('error');
          done();
        })
        .catch(err => {
          expect(err).toEqual(expected);
          done();
        });
    });
    it('should return error when params in valid with eventStartTime > expireDate', done => {
      // arrange
      jest.spyOn(guard, 'isPostBody').mockReturnValue(true);
      const expected = new BadRequestException(
        MessageErrorConstant.BAD_REQUEST,
      );
      // act
      return controller
        .addNewReminder$({
          ...addReminder,
          expireDate: new Date('2020-11-26T08:25:04.810Z'),
        })
        .toPromise()
        .then(() => {
          fail('error');
          done();
        })
        .catch(err => {
          expect(err).toEqual(expected);
          done();
        });
    });
    it('should return error when params in valid with eventStartTime < new Date()', done => {
      // arrange
      jest.spyOn(guard, 'isPostBody').mockReturnValue(true);
      const expected = new BadRequestException(
        MessageErrorConstant.BAD_REQUEST,
      );
      // act
      return controller
        .addNewReminder$({
          ...addReminder,
          eventStartTime: new Date('2025-11-26T08:25:04.810Z'),
        })
        .toPromise()
        .then(() => {
          fail('error');
          done();
        })
        .catch(err => {
          expect(err).toEqual(expected);
          done();
        });
    });
    it('should return success', done => {
      const clientResponse: any = MessageErrorConstant.ADD_SUCCESS;
      // arrange
      jest
        .spyOn(reminderService, 'addNewReminder$')
        .mockReturnValue(of(clientResponse));
      jest.spyOn(guard, 'isPostBody').mockReturnValue(true);
      const expected = clientResponse;
      // act
      return controller
        .addNewReminder$(addReminderSuccess)
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
  });
});
