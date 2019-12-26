import { State } from './state';
import fetch from 'node-fetch';
import { promises } from 'fs';
import { insertionMarker, getMarkedInput, getGenerated } from './utility.marker';
import { logger } from './logger';
import { BaseCliClass } from './utility.baseClass';

export class License extends BaseCliClass {
  constructor(private STATE: State) {
    super();
    this.run();
  }
  private async run() {
    const CONFIG = (await this.STATE.getConfig('license'))!;

    const license = await (await fetch(`https://api.github.com/licenses/${CONFIG.type}`)).json();

    const input = getMarkedInput(CONFIG.out, 'license');

    const readmeText = `Copyright (c) YEAR NAME Licensed under the TYPE license.`
      .replace(/NAME/, CONFIG.name)
      .replace(/YEAR/, CONFIG.year)
      .replace(/TYPE/, license.spdx_id);

    await promises.writeFile(
      CONFIG.out,
      input.replace(insertionMarker.regex, getGenerated(readmeText, 'license'))
    );
    logger.Log('info', `Generated License at `, CONFIG.out);
    await promises.writeFile(
      CONFIG.file,
      license.body.replace(/\[year\]/, CONFIG.year).replace(/\[fullname\]/, CONFIG.name)
    );
    logger.Log('info', `Generated License at `, CONFIG.file);
    if (this._res) {
      this._res();
    }
  }
}
