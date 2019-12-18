## get-badges

<span id="BADGE_GENERATION_MARKER_0"></span>
 [![npmV]( https://img.shields.io/npm/v/suf-cli)](https://www.npmjs.com/package/suf-cli) [![min]( https://img.shields.io/bundlephobia/min/suf-cli)](https://bundlephobia.com/result?p=suf-cli) [![install](https://badgen.net/packagephobia/install/suf-cli)](https://packagephobia.now.sh/result?p=suf-cli) [![githubLastCommit]( https://img.shields.io/github/last-commit/TheRealSyler/suf-cli)](https://github.com/TheRealSyler/suf-cli)
<span id="BADGE_GENERATION_MARKER_1"></span>

### Usage Example

run `get-badges`, for the `BADGE` param pick a key of [Badges](#badges), for the `LINK` param pick a key of [Links](#links).

the badges above have been generated with this config:

```json
{
  "name": "package.name",
  "github": "TheRealSyler",
  "repo": "package.name",
  "out": "README.md",
  "vscode": "",
  "badges": [
    "npmV npm",
    "min bundle",
    "install package",
    "githubLastCommit github",
    "badge=https://img.shields.io/badge/custom-Badge-brightgreen link=https://example.com"
  ]
}
```

<span id="DOC_GENERATION_MARKER_0"></span>
# Docs

- **[cli](#cli)**


- **[config](#config)**

  - [BadgesConfig](#badgesconfig)
  - [TsDocConfig](#tsdocconfig)
  - [Config](#config)
  - [getConfig](#getconfig)
  - [CreateConfig](#createconfig)

- **[logger](#logger)**

  - [colors](#colors)
  - [logger](#logger)

- **[state](#state)**

  - [State](#state)

- **[types](#types)**

  - [Config](#config)
  - [Badges](#badges)
  - [Links](#links)

- **[utils](#utils)**

  - [addArgToConfig](#addargtoconfig)
  - [getPackageJson](#getpackagejson)
  - [URI](#uri)
  - [getArgs](#getargs)

- **[badges](#badges)**

  - [GenBadges](#genbadges)

- **[badges.types](#badges.types)**

  - [Badges](#badges)
  - [Links](#links)

- **[default](#default)**

  - [Default](#default)

- **[tsDoc](#tsdoc)**

  - [TsDoc](#tsdoc)

### cli

### config

##### BadgesConfig

```typescript
interface BadgesConfig {
    name: string;
    github: string;
    vscode?: string;
    repo: string;
    out: string;
    badges: string[];
    externalConfig?: string;
}
```

##### TsDocConfig

```typescript
interface TsDocConfig {
    title: string;
    dir: string;
    out: string;
    include?: string[];
    exclude?: string[];
}
```

##### Config

```typescript
interface Config {
    badges?: BadgesConfig;
    tsDoc?: TsDocConfig;
}
```

##### getConfig

```typescript
function getConfig(args: string[], Package: IPackageJson): Promise<Config>;
```

##### CreateConfig

```typescript
function CreateConfig(Package: IPackageJson, type?: keyof Config, CONFIG?: Config): Promise<Config>;
```

### logger

##### colors

```typescript
const colors: {
    info: string;
    yellow: string;
    blue: string;
    gray: string;
    error: string;
}
```

##### logger

```typescript
const logger: Logger<{
    info: LoggerType;
    error: LoggerType;
    help: LoggerType;
}
```

### state

##### State

```typescript
class State {
    PACKAGE: IPackageJson;
    private _CONFIG;
    ARGS: string[];
    constructor(PACKAGE: IPackageJson, _CONFIG: Config, ARGS: string[]);
    get CONFIG(): Config;
    set CONFIG(v: Config);
    getConfig<T extends keyof Config>(type: T): Promise<Config[T]>;
}
```

### types

##### Config

```typescript
interface Config {
    name: string;
    github: string;
    vscode: string;
    repo: string;
    out: string;
    badges: string[];
    [key: string]: string | string[] | undefined;
}
```

##### Badges

```typescript
interface Badges {
    /**
     * circleCi build.
     */
    circleci: '/circleci/build/github/<GITHUB>/<REPO>';
    /**
     * Vscode Extension Version.
     */
    vscV: '/visual-studio-marketplace/v/<VSCODE>';
    /**
     * Vscode Extension downloads.
     */
    vscD: '/visual-studio-marketplace/d/<VSCODE>';
    /**
     * Vscode Extension installs.
     */
    vscI: '/visual-studio-marketplace/i/<VSCODE>';
    /**
     * Vscode Extension ratings.
     */
    vscR: '/visual-studio-marketplace/r/<VSCODE>';
    /**
     * Bundlephobia Min.
     */
    min: '/bundlephobia/min/<NAME>';
    /**
     * Bundlephobia Minzip.
     */
    minzip: '/bundlephobia/minzip/<NAME>';
    /**
     * Packagephobia Install.
     */
    install: '/packagephobia/install/<NAME>';
    /**
     * Packagephobia Publish.
     */
    publish: '/packagephobia/publish/<NAME>';
    /**
     * Npm Version.
     */
    npmV: '/npm/v/<NAME>';
    /**
     * Npm Weekly Downloads.
     */
    npmDW: '/npm/dw/<NAME>';
    /**
     * Npm Monthly Downloads.
     */
    npmDM: '/npm/dm/<NAME>';
    /**
     * Npm Yearly Downloads.
     */
    npmDY: '/npm/dy/<NAME>';
    /**
     * Npm Total Downloads.
     */
    npmDT: '/npm/dt/<NAME>';
    /**
     * Npm Types.
     */
    npmTypes: '/npm/types/<NAME>';
    /**
     * Npm License.
     */
    npmLicense: '/npm/license/<NAME>';
    /**
     * Npm Node.
     */
    npmNode: '/npm/node/<NAME>';
    /**
     * Npm Dependents.
     */
    npmDep: '/npm/dependents/<NAME>';
    /**
     * GitHub Followers.
     */
    githubFollowers: '/github/followers/<GITHUB>';
    /**
     * GitHub Forks.
     */
    githubForks: '/github/forks/<GITHUB>/<REPO>';
    /**
     * GitHub Starts.
     */
    githubStars: '/github/stars/<GITHUB>/<REPO>';
    /**
     * GitHub Issues.
     */
    githubIssues: '/github/issues/<GITHUB>/<REPO>';
    /**
     * GitHub Last Commit.
     */
    githubLastCommit: '/github/last-commit/<GITHUB>/<REPO>';
    /**
     * Custom, usage example: badge=https://img.shields.io/badge/custom%2C-Badge-brightgreen.
     */
    badge: '<CUSTOM>';
}
```

##### Links

```typescript
interface Links {
    /**
     * Npm package.
     */
    npm: 'https://www.npmjs.com/package/<NAME>';
    /**
     * Github Repo.
     */
    github: 'https://github.com/<GITHUB>/<REPO>';
    /**
     * circleCi Repo Pipelines.
     */
    circleci: 'https://app.circleci.com/github/<GITHUB>/<REPO>/pipelines';
    /**
     * Visual Studio marketplace.
     */
    vscode: 'https://marketplace.visualstudio.com/items?itemName=<VSCODE>';
    /**
     * Bundlephobia Link.
     */
    bundle: 'https://bundlephobia.com/result?p=<NAME>';
    /**
     * Packagephobia Link.
     */
    package: 'https://packagephobia.now.sh/result?p=<NAME>';
    /**
     * Custom, usage example: link=https://example.com.
     */
    link: '<CUSTOM>';
}
```

### utils

##### addArgToConfig

```typescript
function addArgToConfig<T extends Object>(io: {
    name: keyof T;
    args: string[];
    i: number;
    config: T;
    exclude: {
        [key: string]: true | undefined;
    };
}
```

##### getPackageJson

```typescript
function getPackageJson(): Promise<IPackageJson>;
```

##### URI

```typescript
class URI {
    path: string;
    type: 'file' | 'url';
    constructor(path: string);
}
```

##### getArgs

```typescript
function getArgs(): string[];
```

### badges

##### GenBadges

```typescript
class GenBadges {
    private STATE;
    constructor(STATE: State);
    private run;
    private Badge;
    private replacePlaceholders;
}
```

### badges.types

##### Badges

```typescript
interface Badges {
    /**
     * circleCi build.
     */
    circleci: '/circleci/build/github/<GITHUB>/<REPO>';
    /**
     * Vscode Extension Version.
     */
    vscV: '/visual-studio-marketplace/v/<VSCODE>';
    /**
     * Vscode Extension downloads.
     */
    vscD: '/visual-studio-marketplace/d/<VSCODE>';
    /**
     * Vscode Extension installs.
     */
    vscI: '/visual-studio-marketplace/i/<VSCODE>';
    /**
     * Vscode Extension ratings.
     */
    vscR: '/visual-studio-marketplace/r/<VSCODE>';
    /**
     * Bundlephobia Min.
     */
    min: '/bundlephobia/min/<NAME>';
    /**
     * Bundlephobia Minzip.
     */
    minzip: '/bundlephobia/minzip/<NAME>';
    /**
     * Packagephobia Install.
     */
    install: '/packagephobia/install/<NAME>';
    /**
     * Packagephobia Publish.
     */
    publish: '/packagephobia/publish/<NAME>';
    /**
     * Npm Version.
     */
    npmV: '/npm/v/<NAME>';
    /**
     * Npm Weekly Downloads.
     */
    npmDW: '/npm/dw/<NAME>';
    /**
     * Npm Monthly Downloads.
     */
    npmDM: '/npm/dm/<NAME>';
    /**
     * Npm Yearly Downloads.
     */
    npmDY: '/npm/dy/<NAME>';
    /**
     * Npm Total Downloads.
     */
    npmDT: '/npm/dt/<NAME>';
    /**
     * Npm Types.
     */
    npmTypes: '/npm/types/<NAME>';
    /**
     * Npm License.
     */
    npmLicense: '/npm/license/<NAME>';
    /**
     * Npm Node.
     */
    npmNode: '/npm/node/<NAME>';
    /**
     * Npm Dependents.
     */
    npmDep: '/npm/dependents/<NAME>';
    /**
     * GitHub Followers.
     */
    githubFollowers: '/github/followers/<GITHUB>';
    /**
     * GitHub Forks.
     */
    githubForks: '/github/forks/<GITHUB>/<REPO>';
    /**
     * GitHub Starts.
     */
    githubStars: '/github/stars/<GITHUB>/<REPO>';
    /**
     * GitHub Issues.
     */
    githubIssues: '/github/issues/<GITHUB>/<REPO>';
    /**
     * GitHub Last Commit.
     */
    githubLastCommit: '/github/last-commit/<GITHUB>/<REPO>';
    /**
     * Custom, usage example: badge=https://img.shields.io/badge/custom%2C-Badge-brightgreen.
     */
    badge: '<CUSTOM>';
}
```

##### Links

```typescript
interface Links {
    /**
     * Npm package.
     */
    npm: 'https://www.npmjs.com/package/<NAME>';
    /**
     * Github Repo.
     */
    github: 'https://github.com/<GITHUB>/<REPO>';
    /**
     * circleCi Repo Pipelines.
     */
    circleci: 'https://app.circleci.com/github/<GITHUB>/<REPO>/pipelines';
    /**
     * Visual Studio marketplace.
     */
    vscode: 'https://marketplace.visualstudio.com/items?itemName=<VSCODE>';
    /**
     * Bundlephobia Link.
     */
    bundle: 'https://bundlephobia.com/result?p=<NAME>';
    /**
     * Packagephobia Link.
     */
    package: 'https://packagephobia.now.sh/result?p=<NAME>';
    /**
     * Custom, usage example: link=https://example.com.
     */
    link: '<CUSTOM>';
}
```

### default

##### Default

```typescript
class Default {
    private STATE;
    constructor(STATE: State);
    private run;
}
```

### tsDoc

##### TsDoc

```typescript
class TsDoc {
    private STATE;
    constructor(STATE: State);
    private run;
    private createNav;
    private getPaths;
    private operators;
}
```

_Generated with_ **[suf-cli](https://www.npmjs.com/package/suf-cli)**
<span id="DOC_GENERATION_MARKER_1"></span>

<span id="LICENSE_GENERATION_MARKER_0">
Copyright (c) 2019 Leonard Grosoli Licensed under the MIT license.
</span>
