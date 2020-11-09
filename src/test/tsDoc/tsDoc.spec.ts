import { readFileSync, writeFileSync } from 'fs';
import { State } from '../../state';
import { TsDoc } from '../../modules/tsDoc';
import { JestStoreLog } from 'jest-store-log';
import { removeNodeStyles } from 'suf-log';
import { genMessage } from '../../logger';
import { run } from '../../run';

test('TsDoc', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();
  const filePath = 'README.md';

  writeFileSync(filePath, '');

  expect(readFileSync(filePath).toString()).toEqual('');

  await TsDoc(
    new State(
      {},
      {
        tsDoc: {
          dir: __dirname,
          out: filePath,
          title: 'THE TEST',
        },
      },
      'NO_CONFIG_FILE'
    )
  );

  expect(readFileSync(filePath).toString()).toEqual(
    docValue(`
# THE TEST
`)
  );

  expect(removeNodeStyles(log.logs[0])).toEqual(`${genMessage('TsDoc')} ${filePath}`);
});

test('TsDoc: run cli with (t | ts | d.ts | docs) arg', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();
  process.argv = ['', '', 't'];
  const filePath = 'DOCS.md';

  writeFileSync(filePath, '');

  expect(readFileSync(filePath).toString()).toEqual('');

  await run();

  expect(readFileSync(filePath).toString()).toEqual(
    docValue(`
# Docs
`)
  );

  expect(removeNodeStyles(log.logs[0])).toEqual(`${genMessage('TsDoc')} ${filePath}`);

  log.restore();
});

const docValue = (title: string) => `
<span id="DOC_GENERATION_MARKER_0"></span>
${title}
- **[test](#test)**

  - [Test](#test)
  - [TEST](#test)

### test

##### Test

\`\`\`ts
interface Test {
  test: string;
}
\`\`\`

##### TEST

\`\`\`ts
class TEST {
  public test2: string;
  test3: string;
  static test4: string;
}
\`\`\`

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>`;
