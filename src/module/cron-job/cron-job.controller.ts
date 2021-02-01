import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { GetParam } from './cron-job.model.i';
import { CronJobService } from './cron-job.service';
@Controller('cron-job')
export class CronJobController {
  constructor(private readonly cronjobService: CronJobService) {}
  @Post()
  addCron(@Query() param: GetParam) {
    this.cronjobService.addCronJobEachMinutes(param.name, param.seconds);
  }

  @Get()
  @UseGuards(AuthGuard)
  getCrons() {
    this.cronjobService.getCrons();
  }

  @Delete(':name')
  deleteCrons(@Param('name') name: string) {
    this.cronjobService.deleteCron(name);
    //console.log("Delete CronJob" + name);
  }
}
