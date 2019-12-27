#!/usr/bin/env node

import { GenBadges } from './badges';
import { TsDoc } from './tsDoc';
import { getPackageJson, getArgs } from './utility';
import { getConfig } from './config';
import { State } from './state';
import { Default } from './default';
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
        await new TsDoc(STATE).res();
        break;
      case 'l':
      case 'license':
        await new License(STATE).res();
        break;
      case 'h':
      case 'help':
        logger.Log('help');
        break;
      default:
        new Default(STATE);
        break;
    }
  } catch (err) {
    console.error(err);
  }
})();

async function CallAll(STATE: State) {
  await new GenBadges(STATE).res();
  await new TsDoc(STATE).res();
  await new License(STATE).res();
}
