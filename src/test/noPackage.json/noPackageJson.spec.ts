import JestStoreLog from 'jest-store-log';
import { removeNodeStyles } from 'suf-log';
import { mockProcessExit } from 'jest-mock-process';
import { run } from '../../run';

test('cli: no package.json', async () => {
  const log = new JestStoreLog();

  process.chdir(__dirname);
  const mockExit = mockProcessExit('TEST');

  await expect(run()).rejects.toEqual('TEST');

  expect(removeNodeStyles(log.logs[0])).toEqual('No package.json found!');
  mockExit.mockRestore();
  log.restore();
});
