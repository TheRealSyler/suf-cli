import { CreateOrUpdateConfig } from './config';
import { IPackageJson } from 'package-json-type';
import { logger } from './logger';
import { ConfigFile } from './Modules';

export class State {
  constructor(public PACKAGE: IPackageJson, private _CONFIG: ConfigFile) {}

  public get CONFIG(): ConfigFile {
    return this._CONFIG;
  }

  public set CONFIG(v: ConfigFile) {
    logger.Log('error', 'use editConfig.');
  }

  async getConfig<T extends keyof ConfigFile>(type: T): Promise<ConfigFile[T]> {
    if (this._CONFIG[type] !== undefined) {
      return this._CONFIG[type];
    } else {
      return (await CreateOrUpdateConfig(this.PACKAGE, type, this.CONFIG))[type];
    }
  }
}
