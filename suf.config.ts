import { ConfigFile } from './src/modules';

const config: ConfigFile = {
  badges: {
    name: 'suf-cli',
    github: 'TheRealSyler',
    repo: 'suf-cli',
    out: 'README.md',
    badges: [
      'npmV npm',
      'min bundle',
      'install package',
      'githubLastCommit github',
      'circleci circleci',
      'codecov codecov',
    ],
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
    dir: 'dist',
    out: 'README.md',
    include: ['modules', 'badgeTypes'],
  },
};
export default config;
