import 'jest-fetch-mock';
export function mockLicense() {
  fetchMock.mockOnce(
    JSON.stringify({
      spdx_id: 'MIT',
      body: `MIT License

Copyright (c) [year] [fullname]

bla bla bla...
`,
    })
  );
}
