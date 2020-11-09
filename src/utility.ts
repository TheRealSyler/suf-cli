import { promises } from 'fs';
import { Exits } from 'suf-node';
import { IPackageJson } from 'package-json-type';
import { log } from './logger';
export function addArgToConfig<T extends Object>(io: {
  name: keyof T;
  args: string[];
  i: number;
  config: T;
  exclude: { [key: string]: true | undefined };
}) {
  if (io.args[io.i + 1]) {
    const nextArg = io.args[io.i + 1].replace(/["']?([^"']*)["']?/, '$1');
    if (io.exclude[io.name as string] !== undefined) {
      io.config[io.name] = nextArg as any;
    } else {
      io.config[io.name] = nextArg.split(',') as any;
    }
  } else {
    log('error', `--${io.name} ${io.args[io.i + 1]} not Found.`);
  }
}

export async function getPackageJson() {
  const hasPackage = await Exits('./package.json');
  if (!hasPackage) {
    log('info', 'No package.json found!');
    process.exit(1);
  }
  return JSON.parse((await promises.readFile('./package.json')).toString()) as IPackageJson;
}

export class URI {
  type: 'file' | 'url';
  constructor(public path: string) {
    if (path.startsWith('http')) {
      this.type = 'url';
    } else {
      this.type = 'file';
    }
  }
}

export function getArgs() {
  const [, , ...args] = process.argv;
  let ARGS: string[] = [];
  args.forEach((arg, i) => {
    ARGS[i] = arg.toLowerCase();
  });
  return ARGS;
}
