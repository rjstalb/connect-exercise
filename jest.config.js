const { createDefaultPreset } = require('ts-jest');

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    ...tsJestTransformCfg,
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!word-list/.*)', 'jest-runner'],
  moduleNameMapper: {
    '^word-list$': '<rootDir>/node_modules/word-list/index.js',
  },
};
