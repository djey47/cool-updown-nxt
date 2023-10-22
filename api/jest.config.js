/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {  
  clearMocks: true,
  preset: 'ts-jest',
  setupFiles: [
    '<rootDir>/config/jest/globalMocks.ts',
  ],
  testEnvironment: 'node',
};
