import { Badges, Links } from './badgeTypes';

export interface BadgesModuleConfig {
  /**package name */
  name: string;

  /**github username */
  github: string;

  /**vscode publisher.packageName */
  vscode?: string;

  /**github repo name */
  repo: string;

  /**path to readme or other target file */
  out?: string;

  /**Array of badges */
  badges: ([keyof Badges, keyof Links, string] | [keyof Badges, keyof Links] | string)[];

  /**link to external config,(not sure if this still works) */
  externalConfig?: string;
}

export interface TsDocModuleConfig {
  /**title displayed at the top of the generated text */
  title?: string;

  /**path to the d.ts files */
  dir: string;

  /**defaults to README.md */
  out: string;

  /**include all files in array, include and exclude cannot be used at the same time */
  include?: string[];

  /**exclude all files in array, include and exclude cannot be used at the same time */
  exclude?: string[];
}
export interface LicenseModuleConfig {
  /**license type, can be found add https://api.github.com/licenses/TYPE */
  type: string;

  /**license year, use null for current year. */
  year: string | null | number;

  /**full name of the copyright holder */
  name: string;

  /**defaults to README.md */
  out?: string;

  /**defaults to LICENSE */
  file?: string;
}

export interface ConfigFile {
  badges?: BadgesModuleConfig;
  tsDoc?: Partial<TsDocModuleConfig>;
  license?: LicenseModuleConfig;
}
