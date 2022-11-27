import { promises } from 'fs';
import { IPackageJson } from 'package-json-type';
import { Exits } from 'suf-node';
import { log } from './logger';

export async function getPackageJson() {
  const hasPackage = await Exits('./package.json');
  if (!hasPackage) {
    log('info', 'No package.json found!');
    process.exit(1);
  }
  return JSON.parse((await promises.readFile('./package.json')).toString()) as IPackageJson;
}

export function getArgs() {
  const [, , ...args] = process.argv;
  let ARGS: string[] = [];
  args.forEach((arg, i) => {
    ARGS[i] = arg.toLowerCase();
  });
  return ARGS;
}
