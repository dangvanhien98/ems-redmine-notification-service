import { Injectable, Logger } from '@nestjs/common';
import { Cron, SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { GetDataReminder } from '../reminder/reminder.model.i';
import { ReminderService } from '../reminder/reminder.service';
import { SocketServerClientService } from '../socket-server-client/socket-server-client.service';
@Injectable()
export class CronJobService {
  public notificationTotal: number = 0;
  private readonly logger = new Logger(CronJobService.name);
  constructor(
    private schedulerRegistry: SchedulerRegistry,
    private socketServerClient: SocketServerClientService,
    private reminderService: ReminderService,
  ) {}
  @Cron(`0 * * * * *`)
  handleNotification() {
    this.logger.debug(new Date().toLocaleTimeString());
    /** Call service action with reminder list */
    try {
      this.reminderService
        .getReminderList$()
        .subscribe(() => this.logger.log('action completed'));
    } catch (error) {
      this.logger.error(error);
    }
  }

  /** This is only for test */
  addCronJobEachMinutes(name: string, seconds: string) {
    const job = new CronJob(`${seconds} * * * * *`, () => {
      this.logger.warn(`time:(${seconds} seconds) for job <${name}> to run!`);
    });

    this.schedulerRegistry.addCronJob(name, job);
    job.start();

    this.logger.warn(
      `job <${name}> added for each minute at ${seconds} seconds!`,
    );
  }
  deleteCron(name: string) {
    this.schedulerRegistry.deleteCronJob(name);
    this.logger.warn(`job <${name}> deleted`);
  }
  getCrons() {
    const jobs = this.schedulerRegistry.getCronJobs();
    jobs.forEach((value, key, map) => {
      let next;
      try {
        next = value.nextDates().toDate();
      } catch (e) {
        next = 'error: next fire date is in the past!';
      }
      this.logger.log(`job: ${key} -> next: ${next}`);
    });
  }
}
