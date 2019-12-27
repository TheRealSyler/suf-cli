import { writeFile, promises } from 'fs';
import { logger } from './logger';

import { Badges, Links } from './badgeTypes';

import { State } from './state';
import { getMarkedInput, insertionMarker, getGenerated } from './utility.marker';
import { BaseCliClass } from './utility.baseClass';
import { BadgesModuleConfig } from './Modules';

const BADGES: Badges = {
  circleci: '/circleci/build/github/<GITHUB>/<REPO>',
  vscV: '/visual-studio-marketplace/v/<VSCODE>',
  vscD: '/visual-studio-marketplace/d/<VSCODE>',
  vscI: '/visual-studio-marketplace/i/<VSCODE>',
  vscR: '/visual-studio-marketplace/r/<VSCODE>',
  min: '/bundlephobia/min/<NAME>',
  minzip: '/bundlephobia/minzip/<NAME>',
  install: '/packagephobia/install/<NAME>',
  publish: '/packagephobia/publish/<NAME>',
  npmV: '/npm/v/<NAME>',
  npmDM: '/npm/dm/<NAME>',
  npmDT: '/npm/dt/<NAME>',
  npmDW: '/npm/dw/<NAME>',
  npmDY: '/npm/dy/<NAME>',
  npmDep: '/npm/dependents/<NAME>',
  npmLicense: '/npm/license/<NAME>',
  npmNode: '/npm/node/<NAME>',
  npmTypes: '/npm/types/<NAME>',
  githubFollowers: '/github/followers/<GITHUB>',
  githubForks: '/github/forks/<GITHUB>/<REPO>',
  githubStars: '/github/stars/<GITHUB>/<REPO>',
  githubIssues: '/github/issues/<GITHUB>/<REPO>',
  githubLastCommit: '/github/last-commit/<GITHUB>/<REPO>',
  badge: '<CUSTOM>'
};

const LINKS: Links = {
  npm: 'https://www.npmjs.com/package/<NAME>',
  github: 'https://github.com/<GITHUB>/<REPO>',
  circleci: 'https://app.circleci.com/github/<GITHUB>/<REPO>/pipelines',
  vscode: 'https://marketplace.visualstudio.com/items?itemName=<VSCODE>',
  bundle: 'https://bundlephobia.com/result?p=<NAME>',
  package: 'https://packagephobia.now.sh/result?p=<NAME>',
  link: '<CUSTOM>'
};

export class GenBadges extends BaseCliClass {
  constructor(private STATE: State) {
    super();
    this.run();
  }

  private async run() {
    const CONFIG: BadgesModuleConfig = (await this.STATE.getConfig('badges'))!;
    const generatedBadges = this.getBadges(CONFIG);

    const input = getMarkedInput(CONFIG.out, 'badges');

    await promises.writeFile(
      CONFIG.out,
      input.replace(insertionMarker.regex, getGenerated(generatedBadges, 'badges'))
    );
    logger.Log('info', `Generated Badges at `, CONFIG.out);
    if (this._res) {
      this._res();
    }
  }

  private getBadges(CONFIG: BadgesModuleConfig) {
    let out = '';
    for (const _badge of CONFIG.badges) {
      out += this.addBadge(_badge, CONFIG);
    }
    return out.replace(/^ /, '');
  }

  private addBadge(_badge: string, CONFIG: BadgesModuleConfig): string {
    let customLink = '';
    if (/ link=.+/.test(_badge)) {
      customLink = _badge.replace(/.*?link=([^ ]*) ?.*/, '$1');
    }
    let customBadge = '';
    if (/badge=.+/.test(_badge)) {
      customBadge = _badge.replace(/badge=([^ ]*) ?.*/, '$1');
    }
    const split = _badge.split(' ');
    const type = split[0] as keyof Badges;
    const link = split[1] as keyof Links;
    const params = split[2];
    let baseLink = 'https://img.shields.io';
    switch (type) {
      case 'install':
      case 'npmDep':
      case 'npmNode':
      case 'npmLicense':
        baseLink = 'https://badgen.net';
        break;
    }
    if (BADGES[type] || (customBadge && LINKS[link]) || customLink) {
      return ` [![${customBadge ? 'Custom' : type}](${customBadge ? '' : baseLink}${
        customBadge ? customBadge : this.replacePlaceholders(CONFIG, BADGES[type])
      }${params ? params : ''})](${
        customLink ? customLink : this.replacePlaceholders(CONFIG, LINKS[link])
      })`;
    } else {
      logger.Log('info', `Badge: "${split.join(' ')}" is Not Valid.`);
    }

    return '';
  }

  private replacePlaceholders(CONFIG: BadgesModuleConfig, text: string) {
    text = text.replace(/<NAME>/g, CONFIG.name);
    text = text.replace(/<GITHUB>/g, CONFIG.github);
    text = text.replace(/<VSCODE>/g, CONFIG.vscode ? CONFIG.vscode : '');
    text = text.replace(/<REPO>/g, CONFIG.repo);
    return text;
  }
}
