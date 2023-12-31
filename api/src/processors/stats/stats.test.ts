import subSeconds from 'date-fns/subSeconds';
import { AppContext } from '../../common/context';
import { statsProcessor } from './stats';
import { FeatureStatus, PowerStatus } from '../../models/common';
import { LastPowerAttemptReason } from '../diag/models/diag';

jest.useFakeTimers();

jest.mock('../../common/logger', () => ({
  coreLogger: {
    info: jest.fn(),
  },
}));

const NOW = new Date();
const NOW_MINUS_1MIN = subSeconds(NOW, 60);

beforeEach(() => {
  AppContext.resetAll();
});

describe('statistics processor', () => {
  describe('statsProcessor function', () => {
    it('should handle devices without stats yet', async () => {
      // given
      AppContext.get().statistics.perDevice = {};

      // when-then
      statsProcessor();
    });

    it('should compute stats (uptimes) into context', async () => {
      // given
      const { appInfo, statistics, diagnostics } = AppContext.get();
      appInfo.lastStartOn = NOW_MINUS_1MIN;
      statistics.global.appUptimeSeconds = {
        current: 0,
        overall: 120,
      };
      statistics.perDevice['0'].uptimeSeconds = {
        current: 10,
        overall: 100,
      };
      diagnostics['0'] = {
        on: NOW,
        ping: {
          status: FeatureStatus.OK,
        },
        power: {
          state: PowerStatus.ON,
          lastStartAttempt: { reason: LastPowerAttemptReason.NONE },
          lastStopAttempt: { reason: LastPowerAttemptReason.NONE },
        },
        ssh: {
          status: FeatureStatus.OK,
        },
        http: {
          status: FeatureStatus.OK,
          data: {
            statusCode: 200,
            url: 'http://my-nas:5000',
          },
        },
        previous: {
          on: NOW_MINUS_1MIN,
          ping: {
            status: FeatureStatus.OK,
          },
          power: {
            state: PowerStatus.ON,
            lastStartAttempt: { reason: LastPowerAttemptReason.NONE },
            lastStopAttempt: { reason: LastPowerAttemptReason.NONE },
          },
          ssh: {
            status: FeatureStatus.OK,
          },
          http: {
            status: FeatureStatus.OK,
            data: {
              statusCode: 200,
              url: 'http://my-nas:5000',
            },
          },
        },
      };

      // when
      await statsProcessor();

      // then
      expect(statistics).toEqual({
        global: {
          appUptimeSeconds: {
            current: 60,
            overall: 180,
          },
        },
        perDevice: {
          '0': {
            uptimeSeconds: {
              current: 70,
              overall: 160,
            },
          },
        },
      });
    });

    it('should compute stats (uptimes) into context when previous diagnostics and date are not available', async () => {
      // given
      const { appInfo, statistics, diagnostics } = AppContext.get();
      appInfo.lastStartOn = NOW_MINUS_1MIN;
      statistics.global.appUptimeSeconds = {
        current: 0,
        overall: 120,
      };
      statistics.perDevice['0'].uptimeSeconds = {
        current: 10,
        overall: 100,
      };
      diagnostics['0'] = {
        ping: {
          status: FeatureStatus.OK,
        },
        power: {
          state: PowerStatus.ON,
          lastStartAttempt: { reason: LastPowerAttemptReason.NONE },
          lastStopAttempt: { reason: LastPowerAttemptReason.NONE },
        },
        ssh: {
          status: FeatureStatus.OK,
        },
        http: {
          status: FeatureStatus.OK,
          data: {
            statusCode: 200,
            url: 'http://my-nas:5000',
          },
        }
      };

      // when
      await statsProcessor();

      // then
      expect(statistics).toEqual({
        global: {
          appUptimeSeconds: {
            current: 60,
            overall: 180,
          },
        },
        perDevice: {
          '0': {
            uptimeSeconds: {
              current: 0,
              overall: 100,
            },
          },
        },
      });
    });

    it('should compute stats into context when last start date is not available', async () => {
      // given-when
      await statsProcessor();

      // then
      const { statistics } = AppContext.get();
      expect(statistics.global).toEqual({
        appUptimeSeconds: {
          current: 0,
          overall: 0,
        },
      });
    });
  });
});