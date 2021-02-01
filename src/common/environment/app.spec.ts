import { Test, TestingModule } from '@nestjs/testing';
import { AppConfig, IConf, IEnv, fs } from '../../common/environment/app';

let appConfig: AppConfig;

  const conf : IConf = {
    port: 3000,
    appName: "Schedule Service",
    production: true,
    version: "0.0.1",
  }
  
describe('AppConfig', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppConfig],
    }).compile();
    appConfig = module.get<AppConfig>(AppConfig);
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  beforeEach(async () => {
    fs.readFileSync = jest.fn();
  });

  it('should be defined', () => {
    expect(appConfig).toBeDefined();
  });


  describe(AppConfig.prototype.constructor.name, () => {
    it('Should return env value when env is not empty and production is true', () => {
      // arrange
      const  env : IEnv =  {
        APP_PORT: "50000",
        PRODUCTION: "true",
      } ;
     const expected = {
        appName : 'Schedule Service',
        version: '0.0.1',
        port: 50000,
        production: true,
      }
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({}));
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({}));
      // act
      const act = new AppConfig(env);
      // expected
      expect(act).toEqual(expected);

    });
    it('should retun conf when env is empty ', () => {
      // arrange
      const  env : IEnv = {};
      const conf = {
        "app": {
          "port": 1234,
          "production": false
        },
        "mySql": {
          "host": "192.168.4.229",
          "port": 3306,
          "database": "test_db",
          "user": "username",
          "password": "password",
          "multipleStatements": true,
          "connectionLimit" : 10
          
        }
      }
       const packageJson = {
        "name": "Test Name 2",
        "version": "0.0.16",
      }
      
      
      const expectedOb = {
        appName: "Test Name 2",
        port: 1234,
        production: false,
        version: "0.0.16"
      }
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(conf));
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(packageJson));
      // act
      const act = new AppConfig(env);
      // expected
      expect(act).toEqual(expectedOb);

    });

    it('should return config when env is not empty and production is false', () => {
      // arrange
      const  env : IEnv = {
        APP_CONFIG_PATH: "../../assets/config.json",
        APP_PORT: "50000",
        APP_NAME: "ems_reminder",
        PRODUCTION: "false",
      };
      const conf = {
        "app": {
          "port": 1234,
          "production": false
        },
        "mySql": {
          "host": "192.168.4.229",
          "port": 3306,
          "database": "test_db",
          "user": "username",
          "password": "password",
          "multipleStatements": true,
          "connectionLimit" : 10
          
        }
      }
       const packageJson = {
        "name": "Test Name 2",
        "version": "0.0.16",
      }
      
      
      const expectedOb = {
        appName: "Test Name 2",
        port: 50000,
        production: false,
        version: "0.0.16"
      }
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(conf));
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(packageJson));
      // act
      const act = new AppConfig(env);
      // expected
      expect(act).toEqual(expectedOb);

    });

    it('Should return default value when env and conf and package.json are empty ', () => {
      // arrange
      const  env : IEnv = {};
      const expectedOb = {
        appName: "Schedule Service",
        port: 3002,
        production: true,
        version: "0.0.1"
      }
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify({}));
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify({}));
      // act
      const act = new AppConfig(env);
      // expected
      expect(act).toEqual(expectedOb); 

    });
    it('Should return default value when env and conf and package.json are not exist ', () => {
      // arrange
      const expectedOb = {
        appName: "Schedule Service",
        port: 3002,
        production: true,
        version: "0.0.1"
      }
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(undefined));
      jest.spyOn(fs, 'readFileSync').mockReturnValueOnce(JSON.stringify(undefined));
      // act
      const act = new AppConfig();
      // expected
      expect(act).toEqual(expectedOb); 

    });

    it('Should return env APP_CONFIG_PATH and AppConfig.defaultCconfigFile path  when env is not empty ', () => {
      // arrange
      const  env : IEnv =  {
        APP_CONFIG_PATH: "config.json",
        APP_PORT: "50000",
        PRODUCTION: "true",
      } ;

      const conf = {
        "app": {
          "port": 1234,
          "production": false
        },
        "mySql": {
          "host": "192.168.4.229",
          "port": 3306,
          "database": "test_db",
          "user": "username",
          "password": "password",
          "multipleStatements": true,
          "connectionLimit" : 10
          
        }
      }
     const expected = {
        appName : 'Schedule Service',
        version: '0.0.1',
        port: 50000,
        production: true,
      }
      
      // const pathCall = 
      // config path
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(conf));

      // package
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({}));
      // act
      const act = new AppConfig(env);
      // expected
      expect(fs.readFileSync).toHaveBeenCalledWith("config.json",  'utf-8');
      expect(act).toEqual(expected);

    });
    
  });
});
