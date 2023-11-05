import { powerDiag } from './power';
import { LastPowerAttemptReason } from '../models/diag';
import { FeatureStatus, PowerStatus } from '../../../models/common';

import type { DeviceDiagnosticsContext } from '../../../models/context';

const NOW = new Date();
const PREVIOUS_MOMENT = new Date(2023, 0, 1);

beforeAll(() => {
  jest.useFakeTimers({ now: NOW });
});

afterAll(() => {
  jest.useRealTimers();
});

describe('power diag item', () => {
  describe('powerDiag function', () => {
    it('should register an external stop attempt when ping status becomes KO after a while', async () => {
      // given
      const deviceDiags: DeviceDiagnosticsContext = {
        ping: {
          current: {
            on: PREVIOUS_MOMENT,
            status: FeatureStatus.KO,
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
      };

      // when
      const actualDiags = powerDiag(deviceDiags);

      // then
      expect(actualDiags).toEqual({
        state: 'off',
        lastStartAttempt: {
          reason: 'none',
        },
        lastStopAttempt: {
          on: NOW,
          reason: 'external',
        },
      });
    });

    it('should register an external start attempt when ping status becomes OK after a while', async () => {
      // given
      const deviceDiags: DeviceDiagnosticsContext = {
        ping: {
          current: {
            on: PREVIOUS_MOMENT,
            status: FeatureStatus.OK,
          },
        },
        power: {
          state: PowerStatus.OFF,
          lastStartAttempt: {
            reason: LastPowerAttemptReason.NONE,
          },
          lastStopAttempt: {
            reason: LastPowerAttemptReason.NONE,
          },
        },
      };

      // when
      const actualDiags = powerDiag(deviceDiags);

      // then
      expect(actualDiags).toEqual({
        state: 'on',
        lastStartAttempt: {
          on: NOW,
          reason: 'external',
        },
        lastStopAttempt: {
          reason: 'none',
        },
      });
    });
  });
});
