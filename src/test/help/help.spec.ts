import JestStoreLog from 'jest-store-log';
import { removeNodeStyles } from 'suf-log';
import { run } from '../../run';

test('cli: help', async () => {
  process.chdir(__dirname);
  process.argv = ['', '', 'h'];
  const log = new JestStoreLog();
  await run();

  expect(removeNodeStyles(log.logs[1]).replace(/ +/g, '-')).toEqual(`-
-INFO-All-arguments-can-start-with---or---,-but-i-would-recommend-to-just-use-letters.-
-a-|-all-Calls-all-modules.-
-b-|-badges-Calls-the-badges-module.-
-t-|-ts-|-d.ts-|-docs-Calls-the-tsDoc-module.-
-l-|-licence-Calls-the-license-module.-
-h-|-help-Displays-this-Message.-
-`);
  log.restore()

});
