/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest/presets/default',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageDirectory: 'coverage',
    maxConcurrency: 2,
    coveragePathIgnorePatterns: ['LegacyAuthClient', 'testutil'],
    testTimeout: 60000,
    verbose: true,
};
