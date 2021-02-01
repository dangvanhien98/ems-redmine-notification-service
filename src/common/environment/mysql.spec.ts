import { Test, TestingModule } from '@nestjs/testing';
import { IConf, IEnv, MySqlConfig, fs } from '../../common/environment/mysql';


let mySqlConfig: MySqlConfig;

 const  env : IEnv =  {
  MYSQL_CONFIG_PATH: '../../assets/config.json',
  MYSQL_HOST: "192.168.4.227",
  MYSQL_PORT: "3306",
  MYSQL_DATABASE: "ems_reminder",
  MYSQL_USER: "username",
  MYSQL_PASSWORD: "password",
  MYSQL_MULTIPLE_STATEMENTS: true,
 } ;
  const conf : IConf = {
    host: '192.168.4.227',
    port: 3306,
    user: 'username',
    database: 'ems_reminder',
    password: 'password',
    multipleStatements: true,
  }
  
describe('MySqlConfig', () => {
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MySqlConfig],
    }).compile();
    mySqlConfig = module.get<MySqlConfig>(MySqlConfig);
    
  });
  afterEach(() => {
    jest.restoreAllMocks();
    
  });

  beforeEach(async () => {
    fs.readFileSync = jest.fn();
  });

  it('should be defined', () => {
    expect(mySqlConfig).toBeDefined();
  });


  describe(MySqlConfig.prototype.constructor.name, () => {
    it('should return env when env is not empty', () => {
      // arrange
      const  env1 : IEnv =  {
        MYSQL_CONFIG_PATH: '../../assets/config.json',
        MYSQL_HOST: "192.168.4.227",
        MYSQL_PORT: "3308",
        MYSQL_DATABASE: "reminder",
        MYSQL_USER: "username",
        MYSQL_PASSWORD: "password",
        MYSQL_MULTIPLE_STATEMENTS: true,
       } ;
      const expectedOb = {
        database : "reminder",
        host: "192.168.4.227",
        multipleStatements: true,
        password: "password",
        port: 3308,
        user: "username",
      }
      
      //act
      const act = new MySqlConfig(env1);
      // expected
      expect(act).toEqual(expectedOb)
    });

    it(' should return conf when env is empty', () => {
      // arrange
      const  env : IEnv =  {} ;
      const t = {
        "app": {
          "port": 300333,
          "production": false
        },
        "mySql": {
          "host": "host",
          "port": 3300006,
          "database": "db",
          "user": "us",
          "password": "ps",
          "multipleStatements": true,
          
        }
      }

      const expectedOb = {
        database : "db",
        host: "host",
        multipleStatements: true,
        password: "ps",
        port: 3300006,
        user: "us",
      }
      
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(t));
      //act
      const act = new MySqlConfig(env);
      // expected
      expect(act).toEqual(expectedOb)
    });

    it(' should return default property values in mysql.ts when env {} and config {} are empty  ', () => {
      // arrange
      const  env1 : IEnv =  {} ;
      const expectedOb = {
        database : "ems_reminder",
        host: "192.168.4.227",
        multipleStatements: true,
        password: "password",
        port: 3306,
        user: "username",
      }
      
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify({}));
      //act
      const act = new MySqlConfig(env1);
      // expected
      expect(act).toEqual(expectedOb)
    });

    it(' should return default property values in mysql.ts when env  and config  are not exist  ', () => {
      // arrange
      const expectedOb = {
        database : "ems_reminder",
        host: "192.168.4.227",
        multipleStatements: true,
        password: "password",
        port: 3306,
        user: "username",
      }
      
      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(undefined));
      //act
      const act = new MySqlConfig();
      // expected
      expect(act).toEqual(expectedOb)
    });

    it('should return env  MYSQL_CONFIG_PATH path when env is not empty  ', () => {
      // arrange
      const  env1 : IEnv =  {
        MYSQL_CONFIG_PATH: 'configmysql.json',
        MYSQL_HOST: "192.168.4.227",
        MYSQL_PORT: "3308",
        MYSQL_DATABASE: "reminder",
        MYSQL_USER: "username",
        MYSQL_PASSWORD: "password",
        MYSQL_MULTIPLE_STATEMENTS: true,
       } ;
      const expectedOb = {
        database : "reminder",
        host: "192.168.4.227",
        multipleStatements: true,
        password: "password",
        port: 3308,
        user: "username",
      }
      
      const t = {
        "app": {
          "port": 300333,
          "production": false
        },
        "mySql": {
          "host": "host",
          "port": 3300006,
          "database": "db",
          "user": "us",
          "password": "ps",
          "multipleStatements": true,
          
        }
      }

      jest.spyOn(fs, 'readFileSync').mockReturnValue(JSON.stringify(t));
      //act
      const act = new MySqlConfig(env1);
      // expected
      expect(fs.readFileSync).toHaveBeenCalledWith("configmysql.json",  'utf-8');
      expect(act).toEqual(expectedOb)
    });
  });
});
