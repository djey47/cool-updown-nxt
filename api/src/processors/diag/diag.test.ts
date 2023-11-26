import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';
import { FeatureStatus, PowerStatus } from '../../models/common';
import { statsProcessor } from '../stats/stats';
import { diagProcessor } from './diag';
import { pingDiag } from './items/ping';
import { powerDiag } from './items/power';
import { sshDiag } from './items/ssh';
import { httpDiag } from './items/http';

import { type FeatureDiagnostics, LastPowerAttemptReason, type PowerDiagnostics } from './models/diag';

jest.mock('../../common/logger', () => ({
  coreLogger: {
    info: jest.fn(),
  },
}));
jest.mock('../../helpers/recaller');
jest.mock('./items/ping');
jest.mock('./items/ssh');
jest.mock('./items/http');
jest.mock('./items/power');
jest.mock('../stats/stats');

const coreLoggerInfoMock = coreLogger.info as jest.Mock<void>;
const recallMock = recall as jest.Mock<void>;
const pingDiagMock = pingDiag as jest.Mock<Promise<FeatureDiagnostics>>;
const sshDiagMock = sshDiag as jest.Mock<Promise<FeatureDiagnostics>>;
const httpDiagMock = httpDiag as jest.Mock<Promise<FeatureDiagnostics>>;
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
  sshDiagMock.mockReset();
  httpDiagMock.mockReset();
  powerDiagMock.mockReset();
  recallMock.mockReset();
  statsProcessorMock.mockReset();

  AppContext.resetAll();
});

describe('diagnostics processor', () => {
  describe('diag function', () => {
    const defaultResultsOK: FeatureDiagnostics = {
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
      pingDiagMock.mockResolvedValue(defaultResultsOK);
      sshDiagMock.mockResolvedValue(defaultResultsOK);
      httpDiagMock.mockResolvedValue({
        ...defaultResultsOK,
        data: {
          statusCode: 200,
          url: 'http://my-nas:5000',
        },
      });

      // when
      await diagProcessor();

      // then
      expect(AppContext.get().diagnostics['0']).toEqual({
        on: NOW,
        ping: {
          status: 'ok',
        },
        previous: {
          ping: {},
          power: {},
          ssh: {},
          http: {},
        },
        ssh: {
          status: 'ok',
        },
        http: {
          status: 'ok',
          data: {
            statusCode: 200,
            url: 'http://my-nas:5000',
          },
        },
      });
    });

    it('should write logs, perform diagnostics, stats and invoke recaller to call itself again', async () => {
      // given
      pingDiagMock.mockResolvedValue(defaultResultsOK);
      sshDiagMock.mockResolvedValue(defaultResultsOK);
      powerDiagMock.mockReturnValue(defaultPowerResults);

      // when
      await diagProcessor();

      // then
      expect(AppContext.get().diagnostics['0']).toEqual({
        on: NOW,
        ping: {
          status: 'ok',
        },
        power: {
          state: 'on',
          lastStartAttempt: {
            reason: 'api',
          },
          lastStopAttempt: {
            reason: 'external',
          },
        },
        ssh: {
          status: 'ok',
        },
        previous: {
          ping: {
            status: 'n/a',
          },
          power: {
            lastStartAttempt: {
              reason: 'none',
            },
            lastStopAttempt: {
              reason: 'none',
            },
            state: 'n/a',
          },
          ssh: {
            status: 'n/a',
          },
          http: {
            status: 'n/a',
          }
        },
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
          status: FeatureStatus.OK,
        },
        ssh: {
          status: FeatureStatus.OK,
        },
        http: {
          status: FeatureStatus.OK,
        }
      };
      const pingResultsKO: FeatureDiagnostics = {
        ...defaultResultsOK,
        status: FeatureStatus.KO,
      };
      const sshResultsKO: FeatureDiagnostics = {
        ...defaultResultsOK,
        status: FeatureStatus.KO,
      };
      pingDiagMock.mockResolvedValue(pingResultsKO);
      sshDiagMock.mockResolvedValue(sshResultsKO);
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
          status: 'ko',
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
        },
        ssh: {
          message: 'Device with id=0 has failed ping test thus SSH connectivity cannot be tested.',
          status: 'n/a',
        },
        http: {
          message: 'Device with id=0 has failed ping test thus HTTP cannot be tested.',
          status: 'n/a',
        },
        previous: {
          on: previousDate,
          ping: {
            status: 'ok',
          },
          power: {
            lastStartAttempt: {
              reason: 'none',
            },
            lastStopAttempt: {
              reason: 'none',
            },
            state: 'off',
          },
          ssh: {
            status: 'ok',
          },
          http: {
            status: 'ok',
          },
        },

      });

      expect(coreLoggerInfoMock).toHaveBeenCalledTimes(2);
      expect(recallMock).toHaveBeenCalledWith(diagProcessor, 0);
    });
  });
});