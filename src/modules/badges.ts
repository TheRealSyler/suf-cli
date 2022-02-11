import { promises } from 'fs';
import { BadgeTypes, BadgeLinkTypes } from '../badgeTypes';
import { State } from '../state';
import { readFileAndAddMarker, insertionMarker, insertGenerated } from '../utility.marker';
import { BadgesModuleConfig } from '../modules';
import { genMessage, log } from '../logger';

export async function Badges(STATE: State) {
  const CONFIG = await STATE.getConfigSection('badges');

  if (!CONFIG) return;

  const outPath = CONFIG.out || 'README.md';

  const generatedBadges = genBadges(CONFIG);

  const input = readFileAndAddMarker(outPath, 'badges');

  await promises.writeFile(
    outPath,
    input.replace(insertionMarker.regex, insertGenerated(generatedBadges, 'badges'))
  );

  log('info', genMessage('Badges'), outPath);
}

function genBadges(CONFIG: BadgesModuleConfig) {
  let out = '';
  for (const _badge of CONFIG.badges) {
    out += addBadge(_badge, CONFIG);
  }
  return out.replace(/^ /, '');
}

type Badge = BadgesModuleConfig['badges'][keyof BadgesModuleConfig['badges']];

function addBadge(_badge: Badge, CONFIG: BadgesModuleConfig): string {
  const badge = parseBadge(_badge);
  if (Array.isArray(badge)) {
    log('info', `Badge: ${badge} is an invalid badge type.`);
    return '';
  }
  const { type, link, params, split, customBadge, customLink } = badge;

  let baseLink = 'https://img.shields.io';
  switch (type) {
    case 'install':
    case 'npmDep':
    case 'npmNode':
    case 'npmLicense':
      baseLink = 'https://badgen.net';
      break;
    case 'codecov':
      baseLink = 'https://codecov.io';
      break;
  }

  if (BADGES[type] || (customBadge && LINKS[link]) || customLink) {
    return ` [![${customBadge ? 'Custom' : type}](${customBadge ? '' : baseLink}${customBadge ? customBadge : replacePlaceholders(CONFIG, BADGES[type])
      }${params ? params : ''})](${customLink ? customLink : replacePlaceholders(CONFIG, LINKS[link])
      })`;
  }

  log('info', `Badge: "${split.join(' ')}" is not valid.`);

  return '';
}

function parseBadge(badge: Badge) {
  if (typeof badge === 'string') {
    let customLink = '';
    if (/ link=.+/.test(badge)) {
      customLink = badge.replace(/.*?link=([^ ]*) ?.*/, '$1');
    }
    let customBadge = '';
    if (/badge=.+/.test(badge)) {
      customBadge = badge.replace(/badge=([^ ]*) ?.*/, '$1');
    }
    const split = badge.split(' ');
    const type = split[0] as keyof BadgeTypes;
    const link = split[1] as keyof BadgeLinkTypes;
    const params = split[2];
    return { type, customBadge, link, customLink, params, split };
  }
  if (typeof badge === 'object' && Array.isArray(badge)) {
    return {
      type: badge[0],
      link: badge[1],
      params: badge[2] || '',
      customBadge: '',
      customLink: '',
      split: badge,
    };
  }
  return [badge];
}

function replacePlaceholders(CONFIG: BadgesModuleConfig, text: string) {
  text = text.replace(/<NAME>/g, CONFIG.name);
  text = text.replace(/<GITHUB>/g, CONFIG.github);
  text = text.replace(/<VSCODE>/g, CONFIG.vscode || '');
  text = text.replace(/<REPO>/g, CONFIG.repo);
  return text;
}

const BADGES: BadgeTypes = {
  circleci: '/circleci/build/github/<GITHUB>/<REPO>',
  codecov: '/gh/<GITHUB>/<REPO>/branch/master/graph/badge.svg',
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
  // badge: '<CUSTOM>',
};
// https://app.circleci.com/pipelines/github/TheRealSyler/sass-formatter
const LINKS: BadgeLinkTypes = {
  npm: 'https://www.npmjs.com/package/<NAME>',
  github: 'https://github.com/<GITHUB>/<REPO>',
  circleci: 'https://app.circleci.com/pipelines/github/<GITHUB>/<REPO>',
  vscode: 'https://marketplace.visualstudio.com/items?itemName=<VSCODE>',
  bundle: 'https://bundlephobia.com/result?p=<NAME>',
  package: 'https://packagephobia.now.sh/result?p=<NAME>',
  codecov: 'https://codecov.io/gh/<GITHUB>/<REPO>',
  // link: '<CUSTOM>',
};
