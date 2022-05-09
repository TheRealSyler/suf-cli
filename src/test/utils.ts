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

export async function writeToStdin(data: string, stdin: NodeJS.Socket): Promise<void> {
  return await new Promise((res) => {
    setTimeout(() => {
      stdin.emit('data', data);
      res();
    }, 10);
  });
}

export function sleep(n: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, n);
  });
}
