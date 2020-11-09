import { createOrUpdateConfig } from './config';
import { IPackageJson } from 'package-json-type';
import { ConfigFile } from './modules';

export class State {
  constructor(
    public PACKAGE: IPackageJson,
    public readonly CONFIG: ConfigFile,
    public configPath: string
  ) {}

  async getConfigSection<T extends keyof ConfigFile>(type: T): Promise<ConfigFile[T]> {
    if (this.CONFIG[type] !== undefined) {
      return this.CONFIG[type];
    } else {
      const config = await createOrUpdateConfig(this.PACKAGE, type, this);
      if (config) {
        return config[type];
      }
    }
  }
}
