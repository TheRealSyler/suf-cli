import JestStoreLog from 'jest-store-log';
import { run } from '../../run';
import { readFileSync, writeFileSync } from 'fs';
import { mockLicense } from '../utils';
import { removeNodeStyles } from 'suf-log';

test('cli: only license module', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();

  const filePath = 'README.md';

  writeFileSync(filePath, '');

  expect(readFileSync(filePath).toString()).toEqual('');

  mockLicense();

  await run();

  expect(log.all.map((v) => removeNodeStyles(v))).toStrictEqual([
    "SUF Cli (default, All Modules)",
    "Generated License at: README.md",
    "Generated License at: LICENSE",
  ])

  log.restore();
});

