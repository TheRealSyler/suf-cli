// import JestStoreLog from 'jest-store-log';
// import { run } from '../../run';
// import { stdin } from 'mock-stdin';
// import { mockProcessExit } from 'jest-mock-process';
// import { existsSync, readFileSync, writeFileSync } from 'fs';
// import 'jest-fetch-mock';
// import { getYNAnswer } from 'suf-node';

// async function sendData(data: string, stdin: NodeJS.Socket) {
//   await new Promise((res) => {
//     setTimeout(() => {
//       stdin.emit('data', data);
//       res();
//     }, 10);
//   });
// }

test('cli: generateConfig (TODO)', async () => {
  // const log = new JestStoreLog();
  // const io = stdin();
  //   fetchMock.mockOnce(
  //     JSON.stringify({
  //       spdx_id: 'MIT',
  //       body: `MIT License
  // Copyright (c) [year] [fullname]
  // bla bla bla...
  // `,
  //     })
  //   );
  // async function failingAsyncTest() {
  // process.chdir(__dirname);
  // const a = process.exit;
  // process.exit = (code) => {
  //   console.log('EXIT');
  //   console.log(code);
  //   return null as never;
  // };
  // const mockExit = mockProcessExit('TEST');
  // const main = run();
  // const stdin = process.openStdin();
  // await sendData('n', stdin);
  // await main;
  // process.exit = a;
  // mockExit.mockRestore();
  // }
  // await expect(failingAsyncTest()).rejects.toThrow('I should fail');
  // await expect(
  //   new Promise(async (res) => {
  //     res(await a);
  //     // res();
  //   })
  // ).resolves.toThrow();
  // expect(mockExit).toHaveBeenCalledWith(0);
  // expect(a).toBe(false);
  // io.send('n');
  // io.end();
  // io.reset();
  // io.send('n');
  // io.end();
  // io.reset();
  // io.send('n');
  // io.end();
  // io.reset();
  // expect(log.logs).toBe('');
  // io.restore();
  // log.restore();
  //
});
