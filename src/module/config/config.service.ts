import { Injectable } from '@nestjs/common/decorators';
import { AppConfig } from '../../common/environment/app';
import { MySqlConfig } from '../../common/environment/mysql';

@Injectable()
export class ConfigService {
  private readonly app: AppConfig;
  private readonly mySql: MySqlConfig;

  public constructor() {
    this.app = new AppConfig();
    this.mySql = new MySqlConfig();
  }

  public appConfig(): AppConfig {
    return this.app;
  }
  public mySqlConfig(): MySqlConfig {
    return this.mySql;
  }
}
