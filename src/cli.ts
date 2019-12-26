#!/usr/bin/env node

import { GenBadges } from './modules/badges/badges';
import { TsDoc } from './modules/tsDoc/tsDoc';
import { getPackageJson, getArgs } from './utility/utility';
import { getConfig } from './config';
import { State } from './state';
import { Default } from './modules/default/default';
import { License } from './modules/licence/license';

(async () => {
  const args = getArgs();
  const Package = await getPackageJson();
  const config = await getConfig(args, Package);
  const STATE = new State(Package, config, args);
  try {
    switch (args[0]) {
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
