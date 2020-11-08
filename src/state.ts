import { CreateOrUpdateConfig } from './config';
import { IPackageJson } from 'package-json-type';
import { logger } from './logger';
import { ConfigFile } from './Modules';

export class State {
  constructor(public PACKAGE: IPackageJson, public readonly CONFIG: ConfigFile) {}

  async getConfigSection<T extends keyof ConfigFile>(type: T): Promise<ConfigFile[T]> {
    if (this.CONFIG[type] !== undefined) {
      return this.CONFIG[type];
    } else {
      return (await CreateOrUpdateConfig(this.PACKAGE, type, this.CONFIG))[type];
    }
  }
}
