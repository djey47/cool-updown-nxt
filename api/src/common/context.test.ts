import { FeatureStatus, PowerStatus } from '../models/common';
import { LastPowerAttemptReason } from '../processors/diag/models/diag';
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
          power: {
            state: PowerStatus.ON,
            lastStartAttempt: {
              reason: LastPowerAttemptReason.NONE,
            },
            lastStopAttempt: {
              reason: LastPowerAttemptReason.NONE,
            },
          },
        },
      };

      // when
      AppContext.resetAll();

      // then
      expect(AppContext.get()).toEqual({
        appInfo: {},
        diagnostics: {
          '0': {
            ping: {
              current: {
                status: 'n/a',
              },
            },
            power: {
              state: 'n/a',
              lastStartAttempt: {
                reason: 'none',
              },
              lastStopAttempt: {
                reason: 'none',
              },
            },
          },
        },
        statistics: {
          global: {},
          perDevice: {
            '0': {
              uptimeSeconds: {
                current: 0,
                overall: 0,
              },
            },
          },
        },
      });
    });
  })
});
