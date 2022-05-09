import { Badges } from './modules/badges';
import { TsDoc } from './modules/tsDoc';
import { getPackageJson, getArgs } from './utility';
import { getConfig } from './config';
import { State } from './state';
import { License } from './modules/license';
import { log } from './logger';

export async function run() {
  const ARGS = getArgs();
  const Package = await getPackageJson();
  const { config, configPath } = await getConfig(Package);
  const STATE = new State(Package, config, configPath);

  switch (ARGS[0] ? ARGS[0].replace(/^--?/, '') : ARGS[0]) {
    case 'a':
    case 'all':
      await CallAll(STATE);
      break;
    case 'b':
    case 'badges':
      STATE.canCreateOrUpdateConfig = true
      await Badges(STATE);
      break;
    case 't':
    case 'ts':
    case 'd.ts':
    case 'docs':
      STATE.canCreateOrUpdateConfig = true
      await TsDoc(STATE);
      break;
    case 'l':
    case 'license':
      STATE.canCreateOrUpdateConfig = true
      await License(STATE);
      break;
    case 'h':
    case 'help':
      log('help');
      break;
    default:
      await CallAll(STATE);
      break;
  }
}

async function CallAll(STATE: State) {
  await Badges(STATE);
  await TsDoc(STATE);
  await License(STATE);
}
