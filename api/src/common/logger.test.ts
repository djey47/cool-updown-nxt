import { coreLogger, getLoggerConfig } from './logger';
import globalMocks from '../../config/jest/globalMocks';
import resetMocks from '../../config/jest/resetMocks';

afterEach(() => {
  resetMocks();
});

describe('Common logger functions', () => {
  describe('getLoggerConfig function', () => {
    it('should return configuration', () => {
      // given-when
      const actual = getLoggerConfig();

      // then
      expect(actual).toHaveProperty('level');
      expect(actual).toHaveProperty('file');
    });
  });

  describe('coreLogger member', () => {
    it('should be a pino logger instance', () => {
      // given-when-then
      expect(coreLogger).toHaveProperty('pino');
    });    
  })
});
