import { readFileSync } from 'fs';
import { State } from '../../state';
import { Badges } from '../../badges';
import { JestStoreLog } from 'jest-store-log';

test('Badges', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();
  const outFilePath = 'README.md';
  await Badges(
    new State(
      {},
      {
        badges: {
          name: 'suf-cli',
          github: 'TheRealSyler',
          repo: 'suf-cli',
          out: outFilePath,
          badges: ['npmV npm', 'min bundle', 'install package', 'githubLastCommit github'],
        },
      }
    )
  );

  expect(readFileSync(outFilePath).toString()).toEqual(`<span id="BADGE_GENERATION_MARKER_0"></span>
[![npmV](https://img.shields.io/npm/v/suf-cli)](https://www.npmjs.com/package/suf-cli) [![min](https://img.shields.io/bundlephobia/min/suf-cli)](https://bundlephobia.com/result?p=suf-cli) [![install](https://badgen.net/packagephobia/install/suf-cli)](https://packagephobia.now.sh/result?p=suf-cli) [![githubLastCommit](https://img.shields.io/github/last-commit/TheRealSyler/suf-cli)](https://github.com/TheRealSyler/suf-cli)
<span id="BADGE_GENERATION_MARKER_1"></span>`);

  expect(log.logs[0]).toEqual(`%cGenerated Badges at: %c${outFilePath}`);
});
