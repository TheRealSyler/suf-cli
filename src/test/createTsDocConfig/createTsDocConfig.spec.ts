import { State } from '../../state';
import JestStoreLog from 'jest-store-log';
import { removeNodeStyles } from 'suf-log';
import { readFileSync, writeFileSync } from 'fs';
import { sleep, writeToStdin } from '../utils';
import { resolve } from 'path';

test('create TsDoc config', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog({ stdout: true });
  const state = new State({}, {}, 'suf.config.json');
  const section = state.getConfigSection('tsDoc');
  const filePath = 'suf.config.json';
  writeFileSync(filePath, '');
  expect(readFileSync(filePath).toString()).toEqual('');

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
    'Update Config: suf.config.json',
  ]);

  await sleep(1);

  expect(JSON.parse(readFileSync(resolve('suf.config.json')).toString())).toStrictEqual({
    tsDoc: {
      dir: 'awd',
      out: 'test.md',
      title: 'BEST TITLE',
    },
  });
});
