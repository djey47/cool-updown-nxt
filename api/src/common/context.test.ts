import { FeatureStatus } from '../models/common';
import { AppContext } from './context';

describe('AppContext singleton class', () => {
  describe('get static method', () => {
    it('should return always same instance', () => {
      // when
      const actualInstance1 = AppContext.get();
      const actualInstance2 = AppContext.get();

      // then
      expect(actualInstance1).toBe(actualInstance2);
    });
  });

  describe('resetAll static method', () => {
    it('should reset context contents', () => {
      // given
      AppContext.get().diagnostics = {
        '0': {
          on: new Date(),
          ping: {
            current: {
              on: new Date(),
              status: FeatureStatus.OK,
            },
          },
        },
      };

      // when
      AppContext.resetAll();

      // then
      expect(AppContext.get()).toEqual({
        diagnostics: {}
      });
    });
  })
});
