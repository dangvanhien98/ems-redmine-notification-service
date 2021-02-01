import { Test, TestingModule } from '@nestjs/testing';
import { async } from 'rxjs';
import { AppConfig } from '../../common/environment/app';
import { MySqlConfig } from '../../common/environment/mysql';
import { ConfigService } from './config.service';

describe('ConfigService', () => {
  /**Khai báo class thực hiện Unit test */
  let service: ConfigService;
  /** Khai báo tất cả các @Injectable class sử dụng trong CategoryService
   */
  const app = new AppConfig();
  const mySql = new MySqlConfig();

  /**khởi tạo với mỗi spec */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConfigService],
    }).compile();
     service = module.get<ConfigService>(ConfigService);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  /** Function appConfig*/
  describe(ConfigService.prototype.appConfig.name, () => {
    it('should return appConfig', () => {
      // act
      const act = service.appConfig();
      expect(act).toEqual(app);
    });
  });

  /** Function mySqlConfig*/
  describe(ConfigService.prototype.appConfig.name, () => {
    it('should return mySqlConfig', () => {
      // act
      const act = service.mySqlConfig();
      expect(act).toEqual(mySql);
    });
  });
});
