module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'jsx', 'node'],
  roots: ['<rootDir>/src'],
  automock: false,
  setupFiles: [
    "./jest.setup.ts"
  ],
  modulePathIgnorePatterns: [
    "<rootDir>/src/test/state/suf.config.json",
    "<rootDir>/src/test/createTsDocConfig/suf.config.ts",
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
