import { ConfigFile } from './src/Modules';

const config: ConfigFile = {
  badges: {
    name: 'suf-cli',
    github: 'TheRealSyler',
    repo: 'suf-cli',
    out: 'README.md',
    badges: ['npmV npm', 'min bundle', 'install package', 'githubLastCommit github'],
  },
  license: {
    name: 'Leonard Grosoli',
    type: 'mit',
    year: '2019',
    out: 'README.md',
    file: 'LICENSE',
  },
  tsDoc: {
    title: 'Docs',
    dir: 'types',
    out: 'README.md',
    include: ['Modules', 'badgeTypes'],
  },
};
export default config;
