const { pathsToModuleNameMapper } = require('ts-jest/utils')
const tsJestPreset = require('jest-preset-angular/jest-preset').globals['ts-jest']

module.exports = {
  globals: {
    'ts-jest': {
      ...tsJestPreset,
      tsConfig: 'tsconfig.spec.json'
    }
  },
  preset: 'jest-preset-angular',
  roots: ['<rootDir>/'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  setupFilesAfterEnv: ['<rootDir>/src/test.ts'],
  collectCoverage: true,
  coverageReporters: ['html'],
  coverageDirectory: 'coverage/pep',
  moduleNameMapper: pathsToModuleNameMapper(
    {},
    {
      prefix: '<rootDir>/'
    }
  ),
  transformIgnorePatterns: ['node_modules/(?!subsink)']
}
