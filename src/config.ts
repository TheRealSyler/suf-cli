import { logger, colors } from './logger';
import { promises } from 'fs';
import { styler } from '@sorg/log';
import { getYNAnswer, Exits, readConsole } from 'suf-node';
import { IPackageJson } from 'package-json-type';
import fetch from 'node-fetch';
import { ConfigFile, BadgesModuleConfig, TsDocModuleConfig, LicenseModuleConfig } from './Modules';
import { exit } from 'process';

type ConfigExtensions = 'ts' | 'json';
const CONFIG_PATH = (extension: ConfigExtensions) => `./suf.config.${extension}`;

async function checkConfigExists(): Promise<ConfigExtensions | null> {
  if (await Exits(CONFIG_PATH('json'))) return 'json';
  if (await Exits(CONFIG_PATH('ts'))) return 'ts';

  return null;
}

export async function getConfig(Package: IPackageJson) {
  return new Promise<ConfigFile>(async (res) => {
    const extension = await checkConfigExists();
    if (!extension) {
      logger.Log('info', 'No config Found, do you want to create one? ', '[Y/n]');
      const answer = await getYNAnswer();

      if (answer) {
        res(await CreateOrUpdateConfig(Package));
      } else {
        process.exit();
      }
    } else {
      switch (extension) {
        case 'json':
          res(JSON.parse((await promises.readFile(CONFIG_PATH('json'))).toString()));
          break;

        case 'ts':
          try {
            const transpileModule = (await import('typescript')).transpileModule;
            const text = (await promises.readFile(CONFIG_PATH('ts'))).toString();

            res(eval(transpileModule(text, {}).outputText));
          } catch {
            logger.Log('error', 'Please install typescript or use a .json config file!');
            exit(1);
          }
          break;
      }
    }
  });
}

export async function CreateOrUpdateConfig(
  Package: IPackageJson,
  type?: keyof ConfigFile,
  CONFIG?: ConfigFile
) {
  const path = './suf.config.json';
  let config: ConfigFile;
  let updateOrCreate = 'Update';
  if (type) {
    logger.Log('info', `Adding ${type} to Config.`);
    config = { ...CONFIG, [type]: await GetConfigFuncs[type]!(Package) };
  } else {
    /**this will only be executed when there is no config. */
    config = {};
    updateOrCreate = 'Create';
    for (const key in GetConfigFuncs) {
      if (GetConfigFuncs.hasOwnProperty(key)) {
        const ConfigFunc = GetConfigFuncs[key as keyof TGetConfigFuncs];
        logger.Log('info', `Add ${key} to Config?`, '[Y/n]');
        if (await getYNAnswer()) {
          config = { ...config, [key]: await ConfigFunc(Package) };
        }
      }
    }
  }

  console.log(`${styler(`${updateOrCreate} CONFIG`, colors.blue)}: ${path}`);
  promises.writeFile(path, JSON.stringify(config, null, 2));
  return config;
}
type TGetConfigFuncs = {
  badges: (Package: any) => Promise<BadgesModuleConfig>;
  tsDoc: (Package: any) => Promise<TsDocModuleConfig>;
  license: (Package: any) => Promise<LicenseModuleConfig>;
};
const GetConfigFuncs: TGetConfigFuncs = {
  badges: async (Package: any) => {
    return {
      name: await getInp('Name', 'PACKAGE NAME', Package.name),
      github: await getInp('Github', 'Username'),
      repo: await getInp('Github', 'Repo', Package.name),
      out: await getInp('out', 'OUTPUT PATH', 'README.md'),
      badges: [...(await getBadges())],
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
  const licenses: any[] = await (await fetch('https://api.github.com/licenses')).json();
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
    process.stdout.write(styler(`(${_default}) `, colors.gray));

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
