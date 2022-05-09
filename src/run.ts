import { Badges } from './modules/badges';
import { TsDoc } from './modules/tsDoc';
import { getPackageJson, getArgs } from './utility';
import { getConfig } from './config';
import { State } from './state';
import { License } from './modules/license';
import { log } from './logger';

const logIntro = (module: string) => log('intro', 'SUF Cli', `(${module})`)

export async function run() {
  const ARGS = getArgs();
  const Package = await getPackageJson();
  const { config, configPath } = await getConfig(Package);
  const STATE = new State(Package, config, configPath);

  const ARG0 = ARGS[0] && ARGS[0].replace(/^--?/, '').toLowerCase();


  switch (ARG0) {
    case 'a':
    case 'all':
      logIntro('All Modules')
      await CallAll(STATE);
      break;
    case 'b':
    case 'badges':
      logIntro('Badges Module')
      STATE.canCreateOrUpdateConfig = true
      await Badges(STATE);
      break;
    case 't':
    case 'ts':
    case 'd.ts':
    case 'docs':
      logIntro('TsDoc Module')
      STATE.canCreateOrUpdateConfig = true
      await TsDoc(STATE);
      break;
    case 'l':
    case 'license':
      logIntro('License Module')
      STATE.canCreateOrUpdateConfig = true
      await License(STATE);
      break;
    case 'h':
    case 'help':
      logIntro('Help')
      log('help');
      break;
    default:
      logIntro('default, All Modules')
      await CallAll(STATE);
      break;
  }
}

async function CallAll(STATE: State) {
  await Badges(STATE);
  await TsDoc(STATE);
  await License(STATE);
}
