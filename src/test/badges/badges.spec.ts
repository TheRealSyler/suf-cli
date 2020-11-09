import { readFileSync, writeFileSync } from 'fs';
import { State } from '../../state';
import { Badges } from '../../modules/badges';
import { JestStoreLog } from 'jest-store-log';
import { removeNodeStyles } from 'suf-log/dist/utils';
import { genMessage } from '../../logger';
import { run } from '../../run';

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
          badges: ['npmV npm', 'min bundle', 'install package', 'githubLastCommit github', 'awd'],
        },
      },
      'NO_CONFIG_FILE'
    )
  );

  expect(readFileSync(outFilePath).toString()).toEqual(`<span id="BADGE_GENERATION_MARKER_0"></span>
[![npmV](https://img.shields.io/npm/v/suf-cli)](https://www.npmjs.com/package/suf-cli) [![min](https://img.shields.io/bundlephobia/min/suf-cli)](https://bundlephobia.com/result?p=suf-cli) [![install](https://badgen.net/packagephobia/install/suf-cli)](https://packagephobia.now.sh/result?p=suf-cli) [![githubLastCommit](https://img.shields.io/github/last-commit/TheRealSyler/suf-cli)](https://github.com/TheRealSyler/suf-cli)
<span id="BADGE_GENERATION_MARKER_1"></span>`);

  expect(removeNodeStyles(log.logs[0])).toEqual('Badge: "awd" is not valid.');
  expect(removeNodeStyles(log.logs[1])).toEqual(`${genMessage('Badges')} ${outFilePath}`);
  log.restore();
});

test('Badges: run cli with b | badges arg', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();
  process.argv = ['', '', 'b'];
  const filePath = 'BADGES.md';

  writeFileSync(filePath, '');

  expect(readFileSync(filePath).toString()).toEqual('');

  await run();

  expect(readFileSync(filePath).toString()).toEqual(`
<span id="BADGE_GENERATION_MARKER_0"></span>
[![circleci](https://img.shields.io/circleci/build/github/ArcA/suf-cli)](https://app.circleci.com/github/ArcA/suf-cli/pipelines) [![codecov](https://codecov.io/gh/ArcA/suf-cli/branch/master/graph/badge.svg?awd)](https://codecov.io/gh/ArcA/suf-cli) [![Custom](Test)](awd)
<span id="BADGE_GENERATION_MARKER_1"></span>`);
  expect(removeNodeStyles(log.logs[0])).toEqual('Badge: [object Object] is an invalid badge type.');
  expect(removeNodeStyles(log.logs[1])).toEqual(`${genMessage('Badges')} ${filePath}`);

  log.restore();
});
