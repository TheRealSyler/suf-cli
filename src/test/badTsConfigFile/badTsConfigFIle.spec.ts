import JestStoreLog from 'jest-store-log';
import { removeNodeStyles } from 'suf-log';
import { mockProcessExit } from 'jest-mock-process';
import { run } from '../../run';

test('cli: bad ts config', async () => {
  const log = new JestStoreLog();

  process.chdir(__dirname);

  const mockExit = mockProcessExit('TEST');

  await expect(run()).rejects.toEqual('TEST');

  expect(removeNodeStyles(log.logs[0])).toEqual('./suf.config.ts export is invalid.');
  mockExit.mockRestore();
  log.restore();
});
