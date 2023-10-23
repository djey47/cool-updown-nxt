import { coreLogger, getLoggerConfig } from './logger';

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
