import { HttpModule, Module } from '@nestjs/common';
import { ReminderService } from './reminder.service';
import { ReminderController } from './reminder.controller';
import { ReminderGuard } from './reminder.controller.guard';
import { ConfigServiceModule } from '../config';
import { MySqlServiceModule } from 'src/common/providers/mysql/mysql.service.module';
import { SocketServerClientService } from '../socket-server-client/socket-server-client.service';
@Module({
  imports: [ConfigServiceModule, MySqlServiceModule, HttpModule],
  providers: [ReminderService, ReminderGuard, SocketServerClientService],
  controllers: [ReminderController],
})
export class ReminderModule {}
