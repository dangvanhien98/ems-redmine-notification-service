import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CronJobModule } from './module/cron-job/cron-job.module';
import { ReminderModule } from './module/reminder/reminder.module';
import { SocketModule } from './module/socket-server/socket.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    CronJobModule,
    ReminderModule,
    SocketModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
