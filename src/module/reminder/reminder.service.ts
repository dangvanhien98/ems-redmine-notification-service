import { ErrorCode } from './../../common/providers/mysql/client';
import { ConfigService } from '../config';
import { GetDataReminder, Reminder, Users } from './reminder.model.i';
import { MySqlService } from '../../common/providers/mysql/mysql.service';
import { AddReminder } from './reminder.model.i';
import * as moment from 'moment';
import * as _ from 'lodash';
import { SocketServerClientService } from '../socket-server-client/socket-server-client.service';
import { MessageErrorConstant } from '../../common/constants/messageErrorConstant';
import { Injectable, HttpService, BadRequestException } from '@nestjs/common';
import { combineLatest, EMPTY, Observable, throwError, zip, of } from 'rxjs';
import { map, catchError, concatMap } from 'rxjs/operators';
import { IClient } from '../../common/providers/mysql/mysql.service.i';

@Injectable()
export class ReminderService {
  constructor(
    public configService: ConfigService,
    private mySqlService: MySqlService,
    private readonly socketService: SocketServerClientService,
    private readonly httpService: HttpService,
  ) {}

  public addNewReminder$(reminder: AddReminder): Observable<AddReminder> {
    const sqlString = `INSERT INTO reminder 
      ( notification_url
        , event_type
        , event_type_id
        , event_id
        , event_start_time
        , event_title
        , event_description
        , event_view_path
        , reminders
        , before_minute
        , is_repeat
        , expire_date
        , repeat_type
        , repeat_value)
      VALUES (?, ?, ? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,? ,?);`;
    const placeHolder = [
      reminder.notificationUrl,
      reminder.eventType,
      reminder.eventTypeId,
      reminder.eventId,
      moment.utc(reminder.eventStartTime).format('YYYY-MM-DD HH:mm:ss'),
      reminder.eventTitle,
      reminder.eventDescription,
      reminder.eventViewPath,
      this.convertUsersDataToString(reminder.reminders),
      reminder.beforeMinute,
      reminder.isRepeat,
      reminder.expireDate
        ? moment.utc(reminder.expireDate).format('YYYY-MM-DD HH:mm:ss')
        : null,
      reminder.repeatType,
      reminder.repeatValue,
    ];
    const transaction$ = (client: IClient): Observable<any> =>
      client.query$<any>(sqlString, placeHolder).pipe(
        map(res => {
          return MessageErrorConstant.ADD_SUCCESS;
        }),
        catchError(err => {
          return throwError(ErrorCode.categorize(err));
        }),
      );
    return this.mySqlService.controlTransaction$(
      this.configService.mySqlConfig(),
      transaction$,
    );
  }

  public convertUsersDataToString(data: Users[]): string {
    return data.map(user => `${user.userId};${user.userName}`).join(',');
  }

  public sqlReminder(reminder: Reminder): string {
    let stringSql = '';
    let time = this.updateDate(reminder);
    if (!moment(reminder.eventStartTime).isAfter(reminder.expireDate)) {
      stringSql = time
        ? `UPDATE ems_reminder.reminder re
        SET re.event_start_time = '${time}'
        WHERE re.reminder_id = ${reminder.reminderId};`
        : '';
      return stringSql;
    } else
      return (stringSql = time
        ? `DELETE FROM ems_reminder.reminder re
        WHERE re.reminder_id = ${reminder.reminderId};`
        : '');
  }

  public updateDate(reminder: Reminder): string {
    let starTime = moment
      .utc(reminder.eventStartTime)
      .format('YYYY-MM-DD HH:mm:ss');
    let starTime1 = '';
    switch (reminder.repeatType) {
      case 'everyday':
        return (starTime1 = moment
          .utc(starTime)
          .add(1, 'days')
          .format('YYYY-MM-DD HH:mm:ss'));

      case 'weekly':
        return (starTime1 = moment
          .utc(starTime)
          .add(1, 'weeks')
          .format('YYYY-MM-DD HH:mm:ss'));
      case 'monthly':
        starTime1 = moment
          .utc(starTime)
          .add(1, 'months')
          .format('YYYY-MM-DD HH:mm:ss');
        if (reminder.repeatValue === 'lastmonth') {
          return moment
            .utc(starTime1)
            .endOf('month')
            .format('YYYY-MM-DD HH:mm:ss');
        } else {
          let endTime = moment
            .utc(starTime1)
            .subtract(1, 'months')
            .format('YYYY-MM-DD HH:mm:ss');
          if (starTime === endTime) {
            return starTime1;
          } else
            return (starTime1 = moment
              .utc(starTime)
              .add(2, 'months')
              .format('YYYY-MM-DD HH:mm:ss'));
        }
      default:
        return null;
    }
  }

  public getReminderList$(): Observable<any> {
    const sqlString =
      'SELECT \
       reminder_id as reminderId \
      , notification_url as notificationUrl \
      , event_type as eventType \
      , event_type_id as eventTypeId\
      , event_id as eventId \
      , event_start_time as eventStartTime\
      , event_title as eventTitle \
      , event_description as eventDescription \
      , reminders , before_minute as beforeMinute \
      , is_repeat as isRepeat\
      , expire_date as expireDate\
      , repeat_type as repeatType \
      , repeat_value as repeatValue\
      ,event_view_path as eventViewPath \
      FROM ems_reminder.reminder having (DATE_SUB(event_start_time, INTERVAL before_minute MINUTE)) < NOW() FOR UPDATE; ';
    const transaction$ = (client: IClient): Observable<any> =>
      client.query$<Reminder>(sqlString).pipe(
        map(res => {
          let records = res.records
            ?.map(rs => {
              return rs;
            })
            .filter(Boolean);
          return { records: records };
        }),
        concatMap(rs => {
          let updateOrRemove = rs.records?.map(rs => {
            // Kiểm tra lặp
            let sqlQuery = '';
            if (rs.isRepeat === 0 || rs.repeatType === 'normal') {
              // Tạo Notification
              this.createNotification(rs)
                .toPromise()
                .then(([rs1, rs2]) => {
                  let userIds: Number[] = [];
                  if (rs.reminders != undefined || rs.reminders != null) {
                    let rmb = _.toString(rs.reminders).split(',');
                    rmb.map(rs => {
                      if (rs.split(';')[0]) {
                        userIds.push(Number(rs.split(';')[0]));
                      }
                    });
                  }
                  if (rs1) {
                    this.socketService.sendDataReminder({
                      ...rs2,
                      notificationId: rs1.notificationId,
                    });
                  }
                });
              // Xoá row
              sqlQuery = `DELETE FROM ems_reminder.reminder re WHERE re.reminder_id = ${rs.reminderId}`;
            } else {
              this.createNotification(rs)
                .toPromise()
                .then(([rs1, rs2]) => {
                  let userIds: Number[] = [];
                  if (rs.reminders != undefined || rs.reminders != null) {
                    let rmb = _.toString(rs.reminders).split(',');
                    rmb.map(rs => {
                      if (rs.split(';')[0]) {
                        userIds.push(Number(rs.split(';')[0]));
                      }
                    });
                  }
                  if (rs1) {
                    this.socketService.sendDataReminder({
                      ...rs2,
                      notificationId: rs1.notificationId,
                    });
                  }
                });
              sqlQuery = this.sqlReminder(rs);
            }
            return client.query$(sqlQuery);
          });
          return zip(...updateOrRemove);
        }),
        catchError(err => {
          return throwError(ErrorCode.categorize(err));
        }),
      );
    return this.mySqlService.controlTransaction$(
      this.configService.mySqlConfig(),
      transaction$,
    );
  }
  // NOT USE
  // public convertDataToReminder(data: Reminder): Reminder {
  //   let rmb = _.toString(data.reminders)?.split(',');
  //   let reminders = rmb?.map(rs => ({
  //     userId: rs.split(';')[0],
  //     userName: rs.split(';')[1],
  //   }));
  //   return { ...data, reminders: reminders };
  // }
  public updateOrDeleteReminder(reminder: Reminder): Observable<void> {
    let sqlString = this.sqlReminder(reminder);
    console.log(sqlString);

    const transaction$ = (client: IClient): Observable<any> =>
      client.query$<any>(sqlString, null).pipe(
        map(res => {
          console.log(res);
          return {
            message: 'Success !!',
          };
        }),
        catchError(err => {
          return throwError(ErrorCode.categorize(err));
        }),
      );
    return this.mySqlService.controlTransaction$(
      this.configService.mySqlConfig(),
      transaction$,
    );
  }
  public createNotification(reminder: Reminder): Observable<any> {
    let userIds: Number[] = [];
    if (reminder.reminders != undefined || reminder.reminders != null) {
      let rmb = _.toString(reminder.reminders).split(',');
      rmb.map(rs => {
        if (rs.split(';')[0]) {
          userIds.push(Number(rs.split(';')[0]));
        }
      });
    }
    let dataNotification = {
      title: reminder.eventTitle,
      description: reminder.eventDescription,
      timeNotification: new Date(),
      eventId: reminder.eventId,
      eventPath: reminder.eventViewPath,
      userIds: userIds,
      eventStartTime: reminder.eventStartTime,
      eventTypeId: reminder.eventTypeId,
    };
    return combineLatest([
      this.httpService.post(reminder.notificationUrl, dataNotification),
      of(dataNotification),
    ]); // should response object interface Notification
  }
}
