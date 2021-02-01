import { NOTIFICATION_URL } from './../../common/environment/api';
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Get,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { MessageErrorConstant } from '../../common/constants/messageErrorConstant';
import { ReminderGuard } from './reminder.controller.guard';
import { AddReminder } from './reminder.model.i';
import { ReminderService } from './reminder.service';

@Controller('reminder')
export class ReminderController {
  constructor(
    private reminderService: ReminderService,
    private guard: ReminderGuard,
  ) {}

  @Post()
  addNewReminder$(@Body() params: AddReminder): Observable<any> {
    params.notificationUrl
      ? params.notificationUrl
      : (params.notificationUrl = NOTIFICATION_URL);
    params.beforeMinute ? params.beforeMinute : (params.beforeMinute = 12 * 60);
    params.isRepeat ? params.isRepeat : (params.isRepeat = false);
    params.repeatType ? params.repeatType : (params.repeatType = 'normal');
    if (
      !this.guard.isPostBody(params) ||
      params.eventStartTime > params.expireDate ||
      params.eventStartTime < new Date()
    ) {
      return throwError(new BadRequestException(MessageErrorConstant.BAD_REQUEST));
    }

    return this.reminderService.addNewReminder$(params);
  }
  @Get('/sendNotification')
  getReminder() {
    return this.reminderService.getReminderList$();
  }
}
