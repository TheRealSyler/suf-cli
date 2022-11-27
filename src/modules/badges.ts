import { promises } from 'fs';
import { genMessage, log } from '../logger';
import { BadgesModuleConfig } from '../modules';
import { State } from '../state';
import { insertGenerated, insertionMarker, readFileAndAddMarker } from '../utility.marker';

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

const BADGES = {
  /** circleCi build. */
  circleci: '/circleci/build/github/<GITHUB>/<REPO>',
  /** codecov percentage. */
  codecov: '/gh/<GITHUB>/<REPO>/branch/master/graph/badge.svg',
  /** Vscode Extension Version. */
  vscV: '/visual-studio-marketplace/v/<VSCODE>',
  /** Vscode Extension downloads. */
  vscD: '/visual-studio-marketplace/d/<VSCODE>',
  /** Vscode Extension installs. */
  vscI: '/visual-studio-marketplace/i/<VSCODE>',
  /** Vscode Extension ratings. */
  vscR: '/visual-studio-marketplace/r/<VSCODE>',
  /** Bundlephobia Min. */
  min: '/bundlephobia/min/<NAME>',
  /** Bundlephobia Minzip. */
  minzip: '/bundlephobia/minzip/<NAME>',
  /** Packagephobia Install. */
  install: '/packagephobia/install/<NAME>',
  /** Packagephobia Publish. */
  publish: '/packagephobia/publish/<NAME>',
  /** Npm Version. */
  npmV: '/npm/v/<NAME>',
  /** Npm Weekly Downloads. */
  npmDW: '/npm/dw/<NAME>',
  /** Npm Monthly Downloads. */
  npmDM: '/npm/dm/<NAME>',
  /** Npm Yearly Downloads. */
  npmDY: '/npm/dy/<NAME>',
  /** Npm Total Downloads. */
  npmDT: '/npm/dt/<NAME>',
  /** Npm Types. */
  npmTypes: '/npm/types/<NAME>',
  /** Npm License. */
  npmLicense: '/npm/license/<NAME>',
  /** Npm Node. */
  npmNode: '/npm/node/<NAME>',
  /** Npm Dependents. */
  npmDep: '/npm/dependents/<NAME>',
  /** GitHub Followers. */
  githubFollowers: '/github/followers/<GITHUB>',
  /** GitHub Forks. */
  githubForks: '/github/forks/<GITHUB>/<REPO>',
  /** GitHub Starts. */
  githubStars: '/github/stars/<GITHUB>/<REPO>',
  /** GitHub Issues. */
  githubIssues: '/github/issues/<GITHUB>/<REPO>',
  /** GitHub Last Commit. */
  githubLastCommit: '/github/last-commit/<GITHUB>/<REPO>',
  // /** Custom, usage example: badge=https://img.shields.io/badge/custom%2C-Badge-brightgreen. */
  // badge: '<CUSTOM>',
}

export type BadgeTypes = typeof BADGES

// https://app.circleci.com/pipelines/github/TheRealSyler/sass-formatter
const LINKS = {
  /** Npm package. */
  npm: 'https://www.npmjs.com/package/<NAME>',
  /** Github Repo. */
  github: 'https://github.com/<GITHUB>/<REPO>',
  /** circleCi Repo Pipelines. */
  circleci: 'https://app.circleci.com/pipelines/github/<GITHUB>/<REPO>',
  /** Visual Studio marketplace. */
  vscode: 'https://marketplace.visualstudio.com/items?itemName=<VSCODE>',
  /** Bundlephobia Link. */
  bundle: 'https://bundlephobia.com/result?p=<NAME>',
  /** Packagephobia Link. */
  package: 'https://packagephobia.now.sh/result?p=<NAME>',
  /** codecov Link. */
  codecov: 'https://codecov.io/gh/<GITHUB>/<REPO>',
  // /** Custom, usage example: link=https://example.com. */
  // link: '<CUSTOM>',
}

export type BadgeLinkTypes = typeof LINKS
