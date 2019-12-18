import { Config, CreateOrUpdateConfig } from './config';
import { IPackageJson } from 'package-json-type';
import { logger } from './logger';

export class State {
  constructor(public PACKAGE: IPackageJson, private _CONFIG: Config, public ARGS: string[]) {}

  public get CONFIG(): Config {
    return this._CONFIG;
  }

  public set CONFIG(v: Config) {
    logger.Log('error', 'use editConfig.');
  }

  async getConfig<T extends keyof Config>(type: T): Promise<Config[T]> {
    if (this._CONFIG[type] !== undefined) {
      return this._CONFIG[type];
    } else {
      return (await CreateOrUpdateConfig(this.PACKAGE, type, this.CONFIG))[type];
    }
  }
}
