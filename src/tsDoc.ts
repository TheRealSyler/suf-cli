import { Walk } from 'suf-node';
import { readFileSync, writeFile, promises } from 'fs';
import { basename } from 'path';
import { logger } from './logger';

import { State } from './state';
import { TsDocConfig } from './config';
import { getMarkedInput, getGenerated, insertionMarker } from './utility.marker';
import { BaseCliClass } from './utility.baseClass';

const codeBlock = '```';
export class TsDoc extends BaseCliClass {
  constructor(private STATE: State) {
    super();
    this.run();
  }
  private async run() {
    const CONFIG = (await this.STATE.getConfig('tsDoc'))!;

    const filesPaths = await this.getPaths(CONFIG);

    const input = getMarkedInput(CONFIG.out, 'tsDoc');

    const declarationRegex = /(\/\*\*[\S\s]*? \*\/\n)?export (declare|interface) ([\w-]*) ([\w-]*)(.*?;|[\S\s]*?^})/gm;
    let rawText = '';
    const navLinks: string[] = [];
    for (const path of filesPaths) {
      const fileText = readFileSync(path).toString();
      const fileName = path.replace(/.*(\/|\\\\)([\w\.-]*)\.d\.ts/, '$2');
      let m: RegExpExecArray | null;
      if (!fileName.endsWith('.internal')) {
        navLinks.push(`#${fileName}`);
        let res = `\n### ${fileName}\n`;

        while ((m = declarationRegex.exec(fileText)) !== null) {
          if (m.index === declarationRegex.lastIndex) {
            declarationRegex.lastIndex++;
          }
          let [all, comment, declaration, type, name, content] = m;
          if (!/^[\n \t]*internal[\n \t]*/i.test(getComment(comment))) {
            navLinks.push(declaration === 'interface' ? type : name);
            res += `\n##### ${declaration === 'interface' ? type : name}\n
${codeBlock}typescript
${all.replace(/export ?| ?declare ?/g, '')}
${codeBlock}
`;
          }
        }
        rawText += res;
      }
    }

    await promises.writeFile(
      CONFIG.out,
      input.replace(
        insertionMarker.regex,
        getGenerated(`# ${CONFIG.title}\n${this.createNav(navLinks)}${rawText}`, 'tsDoc')
      )
    );
    logger.Log('info', 'Generated Docs at ', CONFIG.out);
    if (this._res) {
      this._res();
    }
  }
  private createNav(links: string[]) {
    let linkRes = '';
    for (const link of links) {
      if (link.startsWith('#')) {
        linkRes += `\n- **[${link.replace(/#/, '')}](${link.toLowerCase()})**\n\n`;
      } else {
        linkRes += `  - [${link}](#${link.toLowerCase()})\n`;
      }
    }
    return linkRes;
  }

  private async getPaths(CONFIG: TsDocConfig) {
    const dir = await Walk(`./${CONFIG.dir}`);
    if (CONFIG.exclude !== undefined && CONFIG.include !== undefined) {
      logger.Log(
        'error',
        '[suf-cli:tsDoc] Cannot use option "include" and "exclude" at the same time, all d.ts files will be used.'
      );
      return dir.filter(fileName => fileName.endsWith('d.ts'));
    }
    const isInclude = CONFIG.include !== undefined ? CONFIG.include.length === 0 : true;
    const type = isInclude ? 'exclude' : 'include';
    const checkArr = CONFIG[type] || [];
    const operator = this.operators[isInclude ? '===' : '!=='];
    const filesPaths = dir.filter(
      fileName =>
        fileName.endsWith('d.ts') &&
        operator(checkArr.indexOf(basename(fileName).replace(/\.d\.ts$/, '')), -1)
    );
    return filesPaths;
  }
  private operators = {
    '!==': function(a: any, b: any) {
      return a !== b;
    },
    '===': function(a: any, b: any) {
      return a === b;
    }
  };
}

function getComment(comment: string) {
  return comment ? comment.replace(/\/?\*\*?\/?/g, '') : '';
}
