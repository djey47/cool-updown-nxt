import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom', // use 'node' for non-DOM projects
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
//   setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default config;
