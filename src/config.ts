import { promises } from 'fs';
import fetch from 'node-fetch';
import { IPackageJson } from 'package-json-type';
import { styler } from 'suf-log';
import { Exits, getYNAnswer, readConsole } from 'suf-node';
import { colors, log } from './logger';
import { BadgesModuleConfig, ConfigFile, LicenseModuleConfig, TsDocModuleConfig } from './modules';
import { State } from './state';

type ConfigExtensions = 'ts' | 'json';
const configPath = (extension: ConfigExtensions) => `./suf.config.${extension}`;

async function checkConfigExists(): Promise<ConfigExtensions | null> {
  /*istanbul ignore else */
  if (await Exits(configPath('json'))) return 'json';
  /*istanbul ignore else */
  if (await Exits(configPath('ts'))) return 'ts';

  return null;
}

export async function getConfig(Package: IPackageJson): Promise<{ config: ConfigFile, configPath: string }> {
  const extension = await checkConfigExists();
  if (!extension) {
    log('info', 'No config Found, do you want to create one? ', '[Y/n]');

    const answer = await getYNAnswer();

    if (answer) {
      const newConfig = await createOrUpdateConfig(Package);
      if (!newConfig) {
        process.exit(0);
      }
      return { config: newConfig, configPath: configPath('json') };
    }

    process.exit(1);
  } else {
    switch (extension) {
      case 'json':
        return {
          config: JSON.parse((await promises.readFile(configPath('json'))).toString()),
          configPath: configPath('json'),
        };

      case 'ts':
        try {
          const transpileModule = (await import('typescript')).transpileModule;
          const text = (await promises.readFile(configPath('ts'))).toString();

          const funcText = transpileModule(text, {}).outputText.replace(
            `Object.defineProperty(exports, "__esModule", { value: true });`
            , "const exports = {default: {}}") + "\nreturn exports.default"


          const config = Function(funcText)();

          if (!config) {
            log('error', `${configPath('ts')} export is invalid.`);
            process.exit(1);
          }
          return { config: config || {}, configPath: configPath('ts') };
        } catch (e) {
          console.log(e);
          log('error', 'Please install typescript or use a json config file!');
          process.exit(1);
        }
    }
  }
}

export async function createOrUpdateConfig(
  packageJson: IPackageJson,
  type?: keyof ConfigFile,
  STATE?: State
) {
  const path = STATE?.configPath || configPath('ts');
  if (!path.endsWith('.ts')) return undefined;
  let config: ConfigFile;
  let updateOrCreate = 'Update';

  if (type && STATE) {
    log('info', `Adding ${type} to Config.`);
    config = { ...STATE.CONFIG, [type]: await configFuncs[type]!(packageJson) };
  } else {
    /**this will only be executed when there is no config. */
    config = {};
    updateOrCreate = 'Create';
    for (const key in configFuncs) {
      if (configFuncs.hasOwnProperty(key)) {
        const configFunc = configFuncs[key as keyof TGetConfigFuncs];
        log('info', `Add ${key} to Config?`, '[Y/n]');
        if (await getYNAnswer()) {
          config = { ...config, [key]: await configFunc(packageJson) };
        }
      }
    }
  }

  console.log(`${styler(`${updateOrCreate} Config`, colors.blue)}: ${path}`);
  promises.writeFile(path, `import { FileConfig } from 'suf-cli'

const config: FileConfig = ${JSON.stringify(config, null, 2).replace(/"(.*)":/, '$1:')}

export default config`);
  return config;
}
type TGetConfigFuncs = {
  badges: (Package: any) => Promise<BadgesModuleConfig>;
  tsDoc: (Package: any) => Promise<TsDocModuleConfig>;
  license: (Package: any) => Promise<LicenseModuleConfig>;
};

const configFuncs: TGetConfigFuncs = {
  badges: async (Package: any) => {
    return {
      name: await getInp('Name', 'PACKAGE NAME', Package.name || ''),
      github: await getInp('Github', 'Username'),
      repo: await getInp('Github', 'Repo', Package.name || ''),
      out: await getInp('out', 'OUTPUT PATH', 'README.md'),
      badges: [...(await getBadges() as any)],
    };
  },
  tsDoc: async () => {
    return {
      title: await getInp('title', 'TITLE', 'Docs'),
      dir: await getInp('dir', 'INPUT PATH', 'dist'),
      out: await getInp('out', 'OUTPUT PATH', 'README.md'),
    };
  },
  license: async () => {
    return {
      name: await getInp('name', 'FULL NAME(S)'),
      type: await getLicenseType(),
      year: await getInp('year', 'YEAR', new Date().getFullYear().toString()),
      out: await getInp('out', 'OUTPUT PATH', 'README.md'),
      file: await getInp('file', 'LICENSE FILE PATH', 'LICENSE'),
    };
  },
};

async function getLicenseType() {
  process.stdout.write(styler('Getting Licenses from api...\n', colors.gray));
  const licenses: any[] = await (await fetch('https://api.github.com/licenses')).json() as any[];
  process.stdout.write(
    styler(
      'Choose From: ' +
      JSON.stringify(
        licenses.map((l) => l.key),
        null,
        2
      ).replace(/[\[\]",]/g, ''),
      colors.gray
    )
  );
  return await getInp('type', 'LICENSE', 'mit');
}

async function getInp(type: string, type2: string, _default?: string) {
  process.stdout.write(styler(type, colors.blue));
  process.stdout.write(styler(` ${type2}`, colors.yellow));
  process.stdout.write(styler(': ', colors.gray));
  if (_default) {
    process.stdout.write(styler(`(${_default})`, colors.gray));

    const input = await readConsole();
    if (input.length === 0) {
      return _default;
    }
    return input;
  }
  return readConsole();
}
async function getBadges(out?: any[]): Promise<string[]> {
  if (!out) {
    out = [];
    process.stdout.write(styler('Press Enter to Accept. ', colors.info));
    process.stdout.write(styler('Format: ', colors.gray));
    process.stdout.write(styler('BADGE ', colors.blue));
    process.stdout.write(styler('LINK ', colors.yellow));
    process.stdout.write(styler('Parameters?\n', colors.gray));
  }
  process.stdout.write(styler('Add', colors.blue));
  process.stdout.write(styler(' Badge', colors.yellow));
  process.stdout.write(styler(': ', colors.gray));

  const input = await readConsole();
  if (/^e$|^end$|^$/i.test(input)) {
    if (input) {
      out.push(input);
    }
    return out;
  } else {
    if (input) {
      out.push(input);
    }
    return await getBadges(out);
  }
}
