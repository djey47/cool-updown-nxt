/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = { 
  coveragePathIgnorePatterns: [
    '<rootDir>/src/app.ts'
  ],
  clearMocks: true,
  preset: 'ts-jest',
  setupFiles: [
    '<rootDir>/config/jest/globalMocks.ts',
  ],
  testEnvironment: 'node',
};
