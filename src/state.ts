import { IPackageJson } from 'package-json-type';
import { createOrUpdateConfig } from './config';
import { ConfigFile } from './modules';

export class State {
  constructor(
    public PACKAGE: IPackageJson,
    public readonly CONFIG: ConfigFile,
    public configPath: string,
    public canCreateOrUpdateConfig = false
  ) { }

  async getConfigSection<T extends keyof ConfigFile>(type: T): Promise<ConfigFile[T]> {
    if (this.CONFIG[type] !== undefined) {
      return this.CONFIG[type];
    } else if (this.canCreateOrUpdateConfig) {
      const config = await createOrUpdateConfig(this.PACKAGE, type, this);
      if (config && config[type]) {
        return config[type];
      }
    }
  }
}
