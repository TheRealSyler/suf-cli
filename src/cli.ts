#!/usr/bin/env node

import { GenBadges } from './badges';
import { TsDoc } from './tsDoc';
import { getPackageJson, getArgs } from './utility';
import { getConfig } from './config';
import { State } from './state';
import { License } from './license';
import { logger } from './logger';

(async () => {
  const ARGS = getArgs();
  const Package = await getPackageJson();
  const config = await getConfig(Package);
  const STATE = new State(Package, config);
  try {
    switch (ARGS[0] ? ARGS[0].replace(/^--?/, '') : ARGS[0]) {
      case 'a':
      case 'all':
        await CallAll(STATE);
        break;
      case 'b':
      case 'badges':
        await new GenBadges(STATE).res();
        break;
      case 't':
      case 'ts':
      case 'd.ts':
      case 'docs':
        await TsDoc(STATE);
        break;
      case 'l':
      case 'license':
        await License(STATE);
        break;
      case 'h':
      case 'help':
        logger.Log('help');
        break;
      default:
        CallAll(STATE);
        break;
    }
  } catch (err) {
    console.error(err);
  }
})();

async function CallAll(STATE: State) {
  await new GenBadges(STATE).res();
  await TsDoc(STATE);
  await License(STATE);
}
