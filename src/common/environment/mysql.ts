import * as _fs from 'fs';
import { join } from 'path';
import { ConnectionConfig } from 'mysql';
// import path from "path";
// from process env : all value is string

/** for Unit test */
export const fs = {..._fs};

export interface IEnv {
  /** set default config path. If don't set, use default file on asset folder */
  MYSQL_CONFIG_PATH?: string;
  MYSQL_HOST?: string;
  MYSQL_PORT?: string;
  MYSQL_DATABASE?: string;
  MYSQL_USER?: string;
  MYSQL_PASSWORD?: string;
  MYSQL_MULTIPLE_STATEMENTS?: boolean;
}

// from config file
export interface IConf {
  host?: string;
  port?: number;
  user?: string;
  database?: string;
  password?: string;
  multipleStatements?: boolean;
}

export class MySqlConfig implements ConnectionConfig {
  /** Default path */

  public static readonly defaultCconfigFile = join(
    __dirname,
    '../../assets/config.json',
  );
  public static readonly configName = 'mySql';

  /** DEFAULT VALUE on Code */
  public host: string = '192.168.4.227';
  public port: number = 3306;
  public database: string = 'ems_reminder';
  public user: string = 'username';
  public password: string = 'password';
  public multipleStatements: boolean = true;

  /** First get environment from process.env */
  constructor(env: IEnv = process.env) {
    let conf: IConf = {};
    try {
      conf =
        JSON.parse(
          fs.readFileSync(
            env.MYSQL_CONFIG_PATH || MySqlConfig.defaultCconfigFile,
            'utf-8',
          ),
        )[MySqlConfig.configName] || {};
    } catch (e) {
      console.log(e);
    }
    console.log(MySqlConfig.defaultCconfigFile, conf);

    this.host = env.MYSQL_HOST || conf.host || this.host;
    this.port = Number(env.MYSQL_PORT || conf.port || this.port);
    this.database = env.MYSQL_DATABASE || conf.database || this.database;
    this.user = env.MYSQL_USER || conf.user || this.user;
    this.password = env.MYSQL_PASSWORD || conf.password || this.password;
    this.multipleStatements =
      env.MYSQL_MULTIPLE_STATEMENTS ||
      conf.multipleStatements ||
      this.multipleStatements;
  }
}
