import { readFileSync, writeFileSync } from 'fs';
import { State } from '../../state';
import { License } from '../../modules/license';
import { JestStoreLog } from 'jest-store-log';
import { removeNodeStyles } from 'suf-log/dist/utils';

import { genMessage } from '../../logger';
import { mockLicense } from '../utils';
import { run } from '../../run';

test('License', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();
  mockLicense();
  await License(
    new State(
      {},
      {
        license: {
          name: 'JOHN DoeIO',
          type: 'mit',
          year: null,
        },
      },
      'NO_CONFIG_FILE'
    )
  );

  expect(readFileSync('./LICENSE').toString()).toEqual(`MIT License

Copyright (c) 2020 JOHN DoeIO

bla bla bla...
`);
  expect(readFileSync('./README.md').toString())
    .toEqual(`<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2020 JOHN DoeIO Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>`);

  expect(removeNodeStyles(log.logs[0])).toEqual(`${genMessage('License')} README.md`);
  expect(removeNodeStyles(log.logs[1])).toEqual(`${genMessage('License')} LICENSE`);
  log.restore();
});

test('License: run cli with (l | license) arg', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();
  process.argv = ['', '', 'l'];
  const filePath = 'LICENSE.md';
  const filePathLicense = 'LICENSE_2';

  writeFileSync(filePath, '');
  expect(readFileSync(filePath).toString()).toEqual('');

  writeFileSync(filePathLicense, '');
  expect(readFileSync(filePathLicense).toString()).toEqual('');

  mockLicense();

  await run();

  expect(readFileSync(filePathLicense).toString()).toEqual(`MIT License

Copyright (c) 3245 JESUS

bla bla bla...
`);

  expect(readFileSync(filePath).toString()).toEqual(`
<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 3245 JESUS Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>`);
  expect(removeNodeStyles(log.logs[0])).toEqual(`${genMessage('License')} LICENSE.md`);
  expect(removeNodeStyles(log.logs[1])).toEqual(`${genMessage('License')} LICENSE_2`);

  log.restore();
});
