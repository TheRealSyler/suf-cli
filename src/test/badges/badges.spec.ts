import { readFileSync, writeFileSync } from 'fs';
import { JestStoreLog } from 'jest-store-log';
import { removeNodeStyles } from 'suf-log';
import { genMessage } from '../../logger';
import { Badges } from '../../modules/badges';
import { run } from '../../run';
import { State } from '../../state';

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
          badges: ['npmV npm', 'min bundle', 'install package', 'githubLastCommit github', 'awd' as any],
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
[![circleci](https://img.shields.io/circleci/build/github/ArcA/suf-cli)](https://app.circleci.com/pipelines/github/ArcA/suf-cli) [![codecov](https://codecov.io/gh/ArcA/suf-cli/branch/master/graph/badge.svg?awd)](https://codecov.io/gh/ArcA/suf-cli) [![Custom](Test)](awd)
<span id="BADGE_GENERATION_MARKER_1"></span>`);
  expect(removeNodeStyles(log.logs[1])).toEqual('Badge: [object Object] is an invalid badge type.');
  expect(removeNodeStyles(log.logs[2])).toEqual(`${genMessage('Badges')} ${filePath}`);

  log.restore();
});

test('Badges: State', async () => {
  expect(
    await new State(
      {},
      { badges: { badges: [], github: 'TEST', name: 'AWD', repo: 'ga' } },
      ''
    ).getConfigSection('badges')
  ).toStrictEqual({ badges: [], github: 'TEST', name: 'AWD', repo: 'ga' });
});
