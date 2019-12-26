import { State } from './state';
import { Config } from './config';
import { GenBadges } from './badges';
import { TsDoc } from './tsDoc';
import { License } from './license';

export class Default {
  constructor(private STATE: State) {
    this.run();
  }
  private async run() {
    const CONFIG = this.STATE.CONFIG;
    for (const key in CONFIG) {
      if (CONFIG.hasOwnProperty(key)) {
        switch (key as keyof Config) {
          case 'badges':
            await new GenBadges(this.STATE).res();
            break;
          case 'tsDoc':
            await new TsDoc(this.STATE).res();
            break;
          case 'license':
            await new License(this.STATE).res();
            break;
          default:
            break;
        }
      }
    }
  }
}
