import { readFileSync, writeFileSync } from 'fs';
import JestStoreLog from 'jest-store-log';
import { resolve } from 'path';
import { removeNodeStyles } from 'suf-log';
import { State } from '../../state';
import { sleep, writeToStdin } from '../utils';

test('create TsDoc config', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog({ stdout: true });
  const filePath = 'suf.config.ts';
  const state = new State({}, {}, filePath, true);
  const section = state.getConfigSection('tsDoc')
  const emptyConfig = 'export default {}';
  writeFileSync(filePath, emptyConfig);
  expect(readFileSync(filePath).toString()).toEqual(emptyConfig);

  const stdin = process.openStdin();

  await writeToStdin('BEST TITLE\n', stdin);
  await writeToStdin('awd\n', stdin);
  await writeToStdin('test.md\n', stdin);

  expect(await section).toStrictEqual({ dir: 'awd', out: 'test.md', title: 'BEST TITLE' });
  expect(log.all.map((v) => removeNodeStyles(v))).toStrictEqual([
    'Adding tsDoc to Config.',
    'title',
    ' TITLE',
    ': ',
    '(Docs)',
    'dir',
    ' INPUT PATH',
    ': ',
    '(dist)',
    'out',
    ' OUTPUT PATH',
    ': ',
    '(README.md)',
    'Update Config: suf.config.ts',
  ]);

  await sleep(10);

  expect(readFileSync(resolve(filePath)).toString()).toStrictEqual(`import { ConfigFile } from 'suf-cli'

const config: ConfigFile = {
  tsDoc: {
    title: "BEST TITLE",
    dir: "awd",
    out: "test.md"
  }
}

export default config`);
});
