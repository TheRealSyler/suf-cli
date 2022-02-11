## suf-cli

suf-cli is a utility cli for automating readme stuff, like adding a license.

<span id="BADGE_GENERATION_MARKER_0"></span>
[![npmV](https://img.shields.io/npm/v/suf-cli)](https://www.npmjs.com/package/suf-cli) [![min](https://img.shields.io/bundlephobia/min/suf-cli)](https://bundlephobia.com/result?p=suf-cli) [![install](https://badgen.net/packagephobia/install/suf-cli)](https://packagephobia.now.sh/result?p=suf-cli) [![githubLastCommit](https://img.shields.io/github/last-commit/TheRealSyler/suf-cli)](https://github.com/TheRealSyler/suf-cli) [![circleci](https://img.shields.io/circleci/build/github/TheRealSyler/suf-cli)](https://app.circleci.com/pipelines/github/TheRealSyler/suf-cli) [![codecov](https://codecov.io/gh/TheRealSyler/suf-cli/branch/master/graph/badge.svg)](https://codecov.io/gh/TheRealSyler/suf-cli)
<span id="BADGE_GENERATION_MARKER_1"></span>

## Usage

```bash
suf
```

this cli works by reading the `suf.config(.json or .ts)` file, every cli module has its section in the config file, if you call the cli without any arguments it will ask you to create a config or it executes all modules present in the config, to add a module just execute the command for that module.

> INFO: All arguments can start with - or --, but i would recommend to just use letters.

| Command                         |                           |
| ------------------------------- | ------------------------- |
| `a` \| `all`                    | Calls all modules.        |
| `b` \| `badges`                 | Calls the badges module.  |
| `t` \| `ts` \| `d.ts` \| `docs` | Calls the tsDoc module.   |
| `l` \| `licence`                | Calls the license module. |
| `h` \| `help`                   | Displays this Message.    |

<span id="DOC_GENERATION_MARKER_0"></span>

# Docs

- **[badgeTypes](#badgetypes)**

  - [BadgeTypes](#badgetypes)
  - [BadgeLinkTypes](#badgelinktypes)

- **[modules](#modules)**

  - [BadgesModuleConfig](#badgesmoduleconfig)
  - [TsDocModuleConfig](#tsdocmoduleconfig)
  - [LicenseModuleConfig](#licensemoduleconfig)
  - [ConfigFile](#configfile)

### badgeTypes

##### BadgeTypes

```ts
interface BadgeTypes {
    /** circleCi build. */
    circleci: '/circleci/build/github/<GITHUB>/<REPO>';
    /** codecov percentage. */
    codecov: '/gh/<GITHUB>/<REPO>/branch/master/graph/badge.svg';
    /** Vscode Extension Version. */
    vscV: '/visual-studio-marketplace/v/<VSCODE>';
    /** Vscode Extension downloads. */
    vscD: '/visual-studio-marketplace/d/<VSCODE>';
    /** Vscode Extension installs. */
    vscI: '/visual-studio-marketplace/i/<VSCODE>';
    /** Vscode Extension ratings. */
    vscR: '/visual-studio-marketplace/r/<VSCODE>';
    /** Bundlephobia Min. */
    min: '/bundlephobia/min/<NAME>';
    /** Bundlephobia Minzip. */
    minzip: '/bundlephobia/minzip/<NAME>';
    /** Packagephobia Install. */
    install: '/packagephobia/install/<NAME>';
    /** Packagephobia Publish. */
    publish: '/packagephobia/publish/<NAME>';
    /** Npm Version. */
    npmV: '/npm/v/<NAME>';
    /** Npm Weekly Downloads. */
    npmDW: '/npm/dw/<NAME>';
    /** Npm Monthly Downloads. */
    npmDM: '/npm/dm/<NAME>';
    /** Npm Yearly Downloads. */
    npmDY: '/npm/dy/<NAME>';
    /** Npm Total Downloads. */
    npmDT: '/npm/dt/<NAME>';
    /** Npm Types. */
    npmTypes: '/npm/types/<NAME>';
    /** Npm License. */
    npmLicense: '/npm/license/<NAME>';
    /** Npm Node. */
    npmNode: '/npm/node/<NAME>';
    /** Npm Dependents. */
    npmDep: '/npm/dependents/<NAME>';
    /** GitHub Followers. */
    githubFollowers: '/github/followers/<GITHUB>';
    /** GitHub Forks. */
    githubForks: '/github/forks/<GITHUB>/<REPO>';
    /** GitHub Starts. */
    githubStars: '/github/stars/<GITHUB>/<REPO>';
    /** GitHub Issues. */
    githubIssues: '/github/issues/<GITHUB>/<REPO>';
    /** GitHub Last Commit. */
    githubLastCommit: '/github/last-commit/<GITHUB>/<REPO>';
}
```

##### BadgeLinkTypes

```ts
interface BadgeLinkTypes {
    /** Npm package. */
    npm: 'https://www.npmjs.com/package/<NAME>';
    /** Github Repo. */
    github: 'https://github.com/<GITHUB>/<REPO>';
    /** circleCi Repo Pipelines. */
    circleci: 'https://app.circleci.com/pipelines/github/<GITHUB>/<REPO>';
    /** Visual Studio marketplace. */
    vscode: 'https://marketplace.visualstudio.com/items?itemName=<VSCODE>';
    /** Bundlephobia Link. */
    bundle: 'https://bundlephobia.com/result?p=<NAME>';
    /** Packagephobia Link. */
    package: 'https://packagephobia.now.sh/result?p=<NAME>';
    /** codecov Link. */
    codecov: 'https://codecov.io/gh/<GITHUB>/<REPO>';
}
```

### modules

##### BadgesModuleConfig

```ts
interface BadgesModuleConfig {
    /**package name */
    name: string;
    /**github username */
    github: string;
    /**vscode publisher.packageName */
    vscode?: string;
    /**github repo name */
    repo: string;
    /**path to readme or other target file */
    out?: string;
    /**Array of badges */
    badges: ([keyof BadgeTypes, keyof BadgeLinkTypes, string] | [keyof BadgeTypes, keyof BadgeLinkTypes] | string)[];
    /**link to external config,(not sure if this still works) */
    externalConfig?: string;
}
```

##### TsDocModuleConfig

```ts
interface TsDocModuleConfig {
    /**title displayed at the top of the generated text */
    title?: string;
    /**path to the d.ts files */
    dir: string;
    /**defaults to README.md */
    out: string;
    /**include all files in array, include and exclude cannot be used at the same time */
    include?: string[];
    /**exclude all files in array, include and exclude cannot be used at the same time */
    exclude?: string[];
}
```

##### LicenseModuleConfig

```ts
interface LicenseModuleConfig {
    /**license type, can be found add https://api.github.com/licenses/TYPE */
    type: string;
    /**license year, use null for current year. */
    year: string | null | number;
    /**full name of the copyright holder */
    name: string;
    /**defaults to README.md */
    out?: string;
    /**defaults to LICENSE */
    file?: string;
}
```

##### ConfigFile

```ts
interface ConfigFile {
    badges?: BadgesModuleConfig;
    tsDoc?: Partial<TsDocModuleConfig>;
    license?: LicenseModuleConfig;
}
```

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>

<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2019 Leonard Grosoli Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>
