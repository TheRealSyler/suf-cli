import { ConfigFile } from '../../modules';

const config: ConfigFile = {
  badges: {
    github: 'ArcA',
    name: 'ASD',
    out: 'BADGES.md',
    repo: 'suf-cli',
    badges: [
      ['circleci', 'circleci'],
      ['codecov', 'codecov', '?awd'],
      'badge=Test link=awd',
      {} as any,
    ],
  },
  tsDoc: {},
};
export default config;
