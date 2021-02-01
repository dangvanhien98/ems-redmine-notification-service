import * as _fs from 'fs';
import { join } from 'path';


/** for Unit test */
export const fs = {..._fs};

// from process env : all value is string
export interface IEnv {
  /** set default config path. If don't set, use default file on asset folder */
  APP_CONFIG_PATH?: string;
  APP_PORT?: string;
  APP_NAME?: string;
  PRODUCTION?: string;
}

// from config file
export interface IConf {
  port?: number;
  appName?: string;
  production?: boolean;
  version?: string;
}

export class AppConfig implements IConf {
  /** Default path */

  public static readonly defaultCconfigFile = join(
    __dirname,
    '../../assets/config.json',
  );
  /** Get app name and version from package */
  public static readonly packageJsonPath = join(
    __dirname,
    '../../../package.json',
  );
  public static readonly configName = 'app';

  /** DEFAULT VALUE on Code */
  public appName: string = 'Schedule Service';
  public version: string = '0.0.1';
  public port: number = 3002;
  public production: boolean = true;

  /** First get environment from process.env */
  constructor(env: IEnv = process.env) {
    let conf: IConf = {};
    let packageJson: { name?: string; version?: string } = {};

    try {
      conf =
        JSON.parse(
          fs.readFileSync(
            env.APP_CONFIG_PATH || AppConfig.defaultCconfigFile,
            'utf-8',
          ),
        )[AppConfig.configName] || {};
    } catch {}

    try {
      packageJson = JSON.parse(
        fs.readFileSync(AppConfig.packageJsonPath, 'utf-8'),
      );
    } catch {}

    this.port = Number(env.APP_PORT || conf.port || this.port);
    this.appName = packageJson.name || this.appName;
    this.version = packageJson.version || this.version;

    if (env.PRODUCTION && /^false$/i.test(env.PRODUCTION)) {
      this.production = false;
    } else if (conf.production === false) {
      this.production = false;
    }
  }
}
