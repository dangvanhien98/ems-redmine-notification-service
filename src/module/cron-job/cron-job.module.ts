import { HttpModule, Module } from '@nestjs/common';
import { CronJobService } from './cron-job.service';
import { CronJobController } from './cron-job.controller';
import { SocketServerClientService } from '../socket-server-client/socket-server-client.service';
import { ReminderModule } from '../reminder/reminder.module';
import { ReminderService } from '../reminder/reminder.service';
import { MySqlServiceModule } from 'src/common/providers/mysql/mysql.service.module';

@Module({
  providers: [CronJobService, SocketServerClientService, ReminderService],
  controllers: [CronJobController],
  imports: [ReminderModule, MySqlServiceModule, HttpModule],
})
export class CronJobModule {}
