import { of } from 'rxjs';
import { MySqlConfig } from '../../common/environment/mysql';

export class ConfigServiceMock {
  public appConfig = jest.fn();
  public mySqlConfig = jest.fn(() => ({} as MySqlConfig));
}

