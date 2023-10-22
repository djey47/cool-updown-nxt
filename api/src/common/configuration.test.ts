import { getBaseConfig, getConfig } from './configuration';

describe('Common Configuration functions', () => {
  describe('getConfig function', () => {
    it('should return configuration wrapper', () => {
      // given-when
      const actual = getConfig();

      // then
      expect(actual.app).toEqual(expect.objectContaining({ diagnosticsIntervalMs: 0 }));
      expect(actual).toHaveProperty('get');
      expect(actual).toHaveProperty('has');
      expect(actual).toHaveProperty('util');
    });
  });

  describe('getBaseConfig function', () => {
    it('should return essential configuration without wrapper', () => {
      // given-when
      const actual = getBaseConfig();

      // then
      expect(actual.app).toEqual(expect.objectContaining({ diagnosticsIntervalMs: 0 }));
      expect(actual).not.toHaveProperty('get');
      expect(actual).not.toHaveProperty('has');
      expect(actual).not.toHaveProperty('util');
    });
  });
});
