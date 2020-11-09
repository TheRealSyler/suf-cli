import JestStoreLog from 'jest-store-log';
import { run } from '../../run';
import { readFileSync, writeFileSync } from 'fs';
import { removeNodeStyles } from 'suf-log';
import { genMessage } from '../../logger';
import { mockLicense } from '../utils';

test('cli: read Config no arg (default)', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();

  const filePath = 'README.md';

  writeFileSync(filePath, '');

  expect(readFileSync(filePath).toString()).toEqual('');

  mockLicense();

  await run();

  testAll(log, filePath);

  log.restore();
});

test('cli: read Config all arg', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();

  const filePath = 'README.md';

  writeFileSync(filePath, '');

  expect(readFileSync(filePath).toString()).toEqual('');

  process.argv = ['', '', 'a'];

  mockLicense();

  await run();

  testAll(log, filePath);

  log.restore();
});

function testAll(log: JestStoreLog, filePath: string) {
  expect(log.logs.map((v) => removeNodeStyles(v))).toStrictEqual([
    `${genMessage('Badges')} ${filePath}`,
    `${genMessage('TsDoc')} ${filePath}`,
    `${genMessage('License')} ${filePath}`,
    `${genMessage('License')} LICENSE`,
  ]);

  expect(readFileSync('./LICENSE').toString()).toEqual(`MIT License

Copyright (c) ${new Date().getFullYear()} JANE OED

bla bla bla...
`);

  expect(readFileSync(filePath).toString()).toEqual(`
<span id="BADGE_GENERATION_MARKER_0"></span>

<span id="BADGE_GENERATION_MARKER_1"></span>
<span id="DOC_GENERATION_MARKER_0"></span>

- **[cli](#cli)**

  - [ImportantCliInterface](#importantcliinterface)
  - [Cli](#cli)

### cli

##### ImportantCliInterface

\`\`\`ts
interface ImportantCliInterface {
  test: string;
}
\`\`\`

##### Cli

\`\`\`ts
class Cli {
  private(): void;
}
\`\`\`

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>
<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) ${new Date().getFullYear()} JANE OED Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>`);
}
