import { Test, TestingModule } from '@nestjs/testing';
import { CronJobController } from './cron-job.controller';

describe('CronJobController', () => {
  let controller: CronJobController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CronJobController],
    }).compile();

    controller = module.get<CronJobController>(CronJobController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
