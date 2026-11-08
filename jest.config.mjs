/** @type {import('jest').Config} */
export default {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/__tests__/**',
    '!src/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  restoreMocks: true,
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  transform: {},
};
