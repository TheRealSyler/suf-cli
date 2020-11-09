import { State } from '../state';
import fetch from 'node-fetch';
import { promises } from 'fs';
import { insertionMarker, readFileAndAddMarker, insertGenerated } from '../utility.marker';
import { genMessage, log } from '../logger';

export async function License(STATE: State) {
  const CONFIG = await STATE.getConfigSection('license');

  if (!CONFIG) return;

  const license = await (await fetch(`https://api.github.com/licenses/${CONFIG.type}`)).json();
  const OUT = CONFIG.out || 'README.md';
  const FILE = CONFIG.file || 'LICENSE';
  const YEAR = CONFIG.year ? CONFIG.year : new Date().getFullYear().toString();
  const input = readFileAndAddMarker(OUT, 'license');

  const readmeText = `Copyright (c) YEAR NAME Licensed under the TYPE license.`
    .replace(/NAME/, CONFIG.name)
    .replace(/YEAR/, YEAR)
    .replace(/TYPE/, license.spdx_id);

  await promises.writeFile(
    OUT,
    input.replace(insertionMarker.regex, insertGenerated(readmeText, 'license'))
  );
  log('info', genMessage('License'), OUT);
  await promises.writeFile(
    FILE,
    license.body.replace(/\[year\]/, YEAR).replace(/\[fullname\]/, CONFIG.name)
  );
  log('info', genMessage('License'), FILE);
}
