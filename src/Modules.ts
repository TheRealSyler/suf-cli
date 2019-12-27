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
  out: string;

  /**Array of badges */
  badges: string[];

  /**link to external config,(not sure if this still works) */
  externalConfig?: string;
}

export interface TsDocModuleConfig {
  /**title displayed at the top of the generated text */
  title: string;

  /**path to the d.ts files */
  dir: string;

  /**path to readme or other target file */
  out: string;

  /**include all files in array, include and exclude cannot be used at the same time */
  include?: string[];

  /**exclude all files in array, include and exclude cannot be used at the same time */
  exclude?: string[];
}
export interface LicenseModuleConfig {
  /**license type */
  type: string;

  /**license year */
  year: string;

  /**full name of the copyright holder */
  name: string;

  /**path to readme or other target file */
  out: string;

  /**path/name of the LICENSE file */
  file: string;
}

export interface ConfigFile {
  badges?: BadgesModuleConfig;
  tsDoc?: TsDocModuleConfig;
  license?: LicenseModuleConfig;
}
