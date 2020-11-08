module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  roots: ['<rootDir>/src'],
  automock: false,
  setupFiles: [
    "./jest.setup.ts"
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
