import { readFileSync } from 'fs';
import { State } from '../../state';
import { License } from '../../license';
import { JestStoreLog } from 'jest-store-log';
import 'jest-fetch-mock';

test('license', async () => {
  process.chdir(__dirname);
  const log = new JestStoreLog();
  fetchMock.mockOnce(
    JSON.stringify({
      spdx_id: 'MIT',
      body: `MIT License

Copyright (c) [year] [fullname]

bla bla bla...
`,
    })
  );
  await License(
    new State(
      {},
      {
        license: {
          name: 'JOHN DoeIO',
          type: 'mit',
          year: null,
        },
      }
    )
  );

  expect(readFileSync('./LICENSE').toString()).toEqual(`MIT License

Copyright (c) 2020 JOHN DoeIO

bla bla bla...
`);
  expect(readFileSync('./README.md').toString())
    .toEqual(`<span id="LICENSE_GENERATION_MARKER_0"></span>
Copyright (c) 2020 JOHN DoeIO Licensed under the MIT license.
<span id="LICENSE_GENERATION_MARKER_1"></span>`);

  expect(log.logs[0]).toEqual(`%cGenerated License at: %cREADME.md`);
  expect(log.logs[1]).toEqual(`%cGenerated License at: %cLICENSE`);
});
