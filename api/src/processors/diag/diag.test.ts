import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';
import { FeatureStatus, PowerStatus } from '../../models/common';
import { statsProcessor } from '../stats/stats';
import { diagProcessor } from './diag';
import { pingDiag } from './items/ping';
import { powerDiag } from './items/power';

import { LastPowerAttemptReason, type FeatureDiagnosticsResults, PowerDiagnostics } from './models/diag';

jest.mock('../../common/logger', () => ({
  coreLogger: {
    info: jest.fn(),
  },
}));
jest.mock('../../helpers/recaller', () => ({
  recall: jest.fn(),
}));
jest.mock('./items/ping', () => ({
  pingDiag: jest.fn(),
}));
jest.mock('./items/power', () => ({
  powerDiag: jest.fn(),
}));
jest.mock('../stats/stats', () => ({
  statsProcessor: jest.fn(),
}));

const coreLoggerInfoMock = coreLogger.info as jest.Mock<void>;
const recallMock = recall as jest.Mock<void>;
const pingDiagMock = pingDiag as jest.Mock<Promise<FeatureDiagnosticsResults>>;
const powerDiagMock = powerDiag as jest.Mock<PowerDiagnostics>;
const statsProcessorMock = statsProcessor as jest.Mock<Promise<void>>;

const NOW = new Date();

jest.useFakeTimers({ now: NOW });

afterAll(() => {
  jest.useRealTimers();
});

beforeEach(() => {
  coreLoggerInfoMock.mockReset();
  pingDiagMock.mockReset();
  powerDiagMock.mockReset();
  recallMock.mockReset();
  statsProcessorMock.mockReset();

  AppContext.resetAll();
});

describe('diagnostics processor', () => {
  describe('diag function', () => {
    const defaultPingResultsOK: FeatureDiagnosticsResults = {
      on: new Date(),
      status: FeatureStatus.OK,
    };
    const defaultPowerResults: PowerDiagnostics = {
      lastStartAttempt: {
        reason: LastPowerAttemptReason.API,
      },
      lastStopAttempt: {
        reason: LastPowerAttemptReason.EXTERNAL,
      },
      state: PowerStatus.ON,
    };

    it('should init diagnostics when not available yet for the device', async () => {
      // given
      AppContext.get().diagnostics = {};
      pingDiagMock.mockResolvedValue(defaultPingResultsOK);

      // when
      await diagProcessor();

      // then
      expect(AppContext.get().diagnostics['0']).toEqual({
        on: NOW,
        ping: {
          current: {
            on: NOW,
            status: 'ok',
          },
        }
      });
    });

    it('should write logs, perform diagnostic, stats and invoke recaller to call itself again', async () => {
      // given
      pingDiagMock.mockResolvedValue(defaultPingResultsOK);
      powerDiagMock.mockReturnValue(defaultPowerResults);

      // when
      await diagProcessor();

      // then
      expect(AppContext.get().diagnostics['0']).toEqual({
        on: NOW,
        ping: {
          current: {
            on: NOW,
            status: 'ok',
          },
          previous: {
            status: 'n/a',
          },
        },
        power: {
          state: 'on',
          lastStartAttempt: {
            reason: 'api',
          },
          lastStopAttempt: {
            reason: 'external',
          },
        }
      });

      expect(coreLoggerInfoMock).toHaveBeenCalledTimes(2);
      expect(recallMock).toHaveBeenCalledWith(diagProcessor, 0);
      expect(statsProcessorMock).toHaveBeenCalledTimes(1);
    });

    it('should update diagnostics in context on a next call', async () => {
      // given
      const previousDate = new Date(2023, 0, 1);
      const appContext = AppContext.get();
      appContext.diagnostics[0] = {
        on: previousDate,
        power: {
          state: PowerStatus.OFF,
          lastStartAttempt: {
            reason: LastPowerAttemptReason.NONE,
          },
          lastStopAttempt: {
            reason: LastPowerAttemptReason.NONE,
          },
        },
        ping: {
          current: {
            on: previousDate,
            status: FeatureStatus.OK,
          },
        }
      };
      const pingResultsKO: FeatureDiagnosticsResults = {
        ...defaultPingResultsOK,
        status: FeatureStatus.KO,
      };
      pingDiagMock.mockResolvedValue(pingResultsKO);
      const powerResults: PowerDiagnostics = {
        ...defaultPowerResults,
        lastStartAttempt: {
          on: NOW,
          reason: LastPowerAttemptReason.API,
        }
      };
      powerDiagMock.mockReturnValue(powerResults);

      // when
      await diagProcessor();

      // then
      expect(appContext.diagnostics['0']).toEqual({
        on: NOW,
        ping: {
          current: {
            on: NOW,
            status: 'ko',
          },
          previous: {
            on: previousDate,
            status: 'ok',
          },
        },
        power: {
          state: 'on',
          lastStartAttempt: {
            on: NOW,
            reason: 'api',
          },
          lastStopAttempt: {
            reason: 'external',
          },
        }
      });

      expect(coreLoggerInfoMock).toHaveBeenCalledTimes(2);
      expect(recallMock).toHaveBeenCalledWith(diagProcessor, 0);
    });
  });
});