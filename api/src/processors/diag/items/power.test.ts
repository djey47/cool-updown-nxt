import subMinutes from 'date-fns/subMinutes/index.js';
import { powerDiag } from './power';
import { LastPowerAttemptReason } from '../models/diag';
import { FeatureStatus, PowerStatus } from '../../../models/common';

import type { DeviceDiagnosticsContext } from '../../../models/context';

const NOW = new Date();
const EVEN_MORE_PREVIOUS_MOMENT = new Date(2022, 11, 31);
const EVEN_MORE_PREVIOUS_MOMENT_MINUS_10MIN = subMinutes(EVEN_MORE_PREVIOUS_MOMENT, 10);

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
          status: FeatureStatus.KO,
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
        ssh: {
          status: FeatureStatus.UNAVAILABLE,
        },
        http: {
          status: FeatureStatus.UNAVAILABLE,
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
          status: FeatureStatus.OK,
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
        ssh: {
          status: FeatureStatus.OK,
        },
        http: {
          status: FeatureStatus.OK,
          data: {
            statusCode: 200,
          },
        }
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

    it('should update an external start attempt even when previously turned ON and OFF from external attempts', async () => {
      // given
      const deviceDiags: DeviceDiagnosticsContext = {
        ping: {
          status: FeatureStatus.OK,
        },
        power: {
          state: PowerStatus.OFF,
          lastStartAttempt: {
            on: EVEN_MORE_PREVIOUS_MOMENT_MINUS_10MIN,
            reason: LastPowerAttemptReason.EXTERNAL,
          },
          lastStopAttempt: {
            on: EVEN_MORE_PREVIOUS_MOMENT,
            reason: LastPowerAttemptReason.EXTERNAL,
          },
        },
        ssh: {
          status: FeatureStatus.OK,
        },
        http: {
          status: FeatureStatus.OK,
          data: {
            statusCode: 200,
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
          on: EVEN_MORE_PREVIOUS_MOMENT,
          reason: 'external',
        },
      });
    });

    it('should update an external stop attempt even when previously turned OFF and ON from external attempts', async () => {
      // given
      const deviceDiags: DeviceDiagnosticsContext = {
        ping: {
          status: FeatureStatus.KO,
        },
        power: {
          state: PowerStatus.ON,
          lastStartAttempt: {
            on: EVEN_MORE_PREVIOUS_MOMENT,
            reason: LastPowerAttemptReason.EXTERNAL,
          },
          lastStopAttempt: {
            on: EVEN_MORE_PREVIOUS_MOMENT_MINUS_10MIN,
            reason: LastPowerAttemptReason.EXTERNAL,
          },
        },
        ssh: {
          status: FeatureStatus.UNAVAILABLE,
        },
        http: {
          status: FeatureStatus.UNAVAILABLE,
        }
      };

      // when
      const actualDiags = powerDiag(deviceDiags);

      // then
      expect(actualDiags).toEqual({
        state: 'off',
        lastStartAttempt: {
          on: EVEN_MORE_PREVIOUS_MOMENT,
          reason: 'external',
        },
        lastStopAttempt: {
          on: NOW,
          reason: 'external',
        },
      });
    });
  });
});
