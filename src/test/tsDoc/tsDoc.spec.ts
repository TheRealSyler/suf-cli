import { readFileSync } from 'fs';
import { State } from '../../state';
import { TsDoc } from '../../tsDoc';
import { JestStoreLog } from 'jest-store-log';
test('tsDoc', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();
  const outFilePath = 'test.md';
  await TsDoc(
    new State(
      {},
      {
        tsDoc: {
          dir: __dirname,
          out: outFilePath,
          title: 'THE TEST',
        },
      }
    )
  );

  expect(readFileSync(outFilePath).toString()).toEqual(`<span id="DOC_GENERATION_MARKER_0"></span>

# THE TEST

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
<span id="DOC_GENERATION_MARKER_1"></span>`);

  expect(log.logs[0]).toEqual(`%cGenerated Docs at: %c${outFilePath}`);
});
