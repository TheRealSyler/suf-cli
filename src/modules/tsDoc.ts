import { Walk } from 'suf-node';
import { readFileSync, promises } from 'fs';
import { basename, resolve } from 'path';

import { State } from '../state';
import { readFileAndAddMarker, insertGenerated, insertionMarker } from '../utility.marker';
import { TsDocModuleConfig } from '../modules';
import { genMessage, log } from '../logger';

const codeBlock = '```';

export async function TsDoc(STATE: State) {
  const section = await STATE.getConfigSection('tsDoc');

  if (section === undefined) return;

  const CONFIG = addDefaultsToConfig(section);

  const filesPaths = await getPaths(CONFIG);

  const input = readFileAndAddMarker(CONFIG.out, 'tsDoc');

  const declarationBlockRegex = /(\/\*\*?[\S\s]*?\*\/\n)?export[ \t]*(declare|interface)[ \t]*([\w-]*)[ \t]*([\w-]*)(.*?;|[\S\s]*?^})/gm;
  let output = '';
  const navLinks: string[] = [];
  for (const path of filesPaths) {
    const fileText = readFileSync(path).toString();
    const fileName = path.replace(/.*(\/|\\\\|\\)([\w\.-]*)\.d\.ts/, '$2');
    let match: RegExpExecArray | null;
    navLinks.push(`#${fileName}`);
    let fileOutput = `\n### ${fileName}\n`;

    while ((match = declarationBlockRegex.exec(fileText)) !== null) {
      /* istanbul ignore if */
      if (match.index === declarationBlockRegex.lastIndex) {
        declarationBlockRegex.lastIndex++;
      }

      let [all, comment, declaration, type, name, content] = match;
      const isInternalDeclaration = /^internal/i.test(convertComment(comment));

      if (!isInternalDeclaration) {
        navLinks.push(declaration === 'interface' ? type : name);

        fileOutput += `\n##### ${declaration === 'interface' ? type : name}\n
${codeBlock}ts
${all.replace(/export ?| ?declare ?/g, '').replace(/\n^[ \t]*private .*$/gm, '')}
${codeBlock}
`;
      }
    }
    output += fileOutput;
  }

  const title = CONFIG.title ? `\n# ${CONFIG.title}\n` : '';
  await promises.writeFile(
    CONFIG.out,
    input.replace(
      insertionMarker.regex,
      insertGenerated(`${title}${createNav(navLinks)}${output}`, 'tsDoc')
    )
  );

  log('info', genMessage('TsDoc'), CONFIG.out);
}

function addDefaultsToConfig(config: Partial<TsDocModuleConfig>): TsDocModuleConfig {
  return {
    ...config,

    dir: /* istanbul ignore next */ config?.dir || '',
    out: /* istanbul ignore next */ config?.out || 'README.md',
  };
}

async function getPaths(CONFIG: TsDocModuleConfig) {
  const dir = await Walk(resolve('./', CONFIG.dir));

  if (CONFIG.exclude !== undefined && CONFIG.include !== undefined) {
    log(
      'error',
      '[suf-cli:tsDoc] Cannot use option "include" and "exclude" at the same time, all d.ts files will be used.'
    );
    return dir.filter((fileName) => fileName.endsWith('d.ts'));
  }
  const isInclude = CONFIG.include !== undefined ? CONFIG.include.length === 0 : true;
  const type = isInclude ? 'exclude' : 'include';
  const checkArr = CONFIG[type] || [];

  const includeCheck = (a: any, b: any) => a === b;
  const excludeCheck = (a: any, b: any) => a !== b;
  const check = isInclude ? includeCheck : excludeCheck;

  const filename = (name: string) => basename(name).replace(/\.d\.ts$/, '');

  const filesPaths = dir.filter(
    (fileName) => fileName.endsWith('d.ts') && check(checkArr.indexOf(filename(fileName)), -1)
  );
  return filesPaths;
}

function createNav(links: string[]) {
  let output = '';
  for (const link of links) {
    if (link.startsWith('#')) {
      output += `\n- **[${link.replace(/#/, '')}](${link.toLowerCase()})**\n\n`;
    } else {
      output += `  - [${link}](#${link.toLowerCase()})\n`;
    }
  }
  return output;
}

function convertComment(comment: string) {
  return comment ? comment.replace(/(\/?\*\*?\/?|[\t \n]*)/g, '') : '';
}
