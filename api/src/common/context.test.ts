import globalMocks from '../../config/jest/globalMocks';
import resetMocks from '../../config/jest/resetMocks';
import { FeatureStatus, PowerStatus } from '../models/common';
import { LastPowerAttemptReason } from '../processors/diag/models/diag';
import { AppContext } from './context';
import { coreLogger } from './logger';

const { appRootDirMock, node: { fsMock }} = globalMocks;

jest.mock('./logger', () => ({
  coreLogger: {
    info: jest.fn(),
  },
}));
const coreLoggerInfoMock = coreLogger.info as jest.Mock<void>;

const NOW = new Date();

beforeAll(() => {
  jest.useFakeTimers({
    now: NOW,
  })
});

beforeEach(() => {
  AppContext.resetAll();
  coreLoggerInfoMock.mockReset();
  resetMocks();

  appRootDirMock.get.mockReturnValue('/');
});

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
  });

  describe('persist static method', () => {
    it('should write context to file asynchronously', () => {
      // given
      AppContext.get().appInfo.initialUptimeSeconds = 55;

      // when
      AppContext.persist();

      // then
      const expectedContents = JSON.stringify({
        meta: {
          persistedOn: NOW,
        },
        contents: {
          appInfo: {
            initialUptimeSeconds: 55,
          },
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
                  reason: 'none'
                },
                lastStopAttempt: {
                  reason: 'none'
                }
              }
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
        },
      }, null, 2);
      expect(fsMock.writeFile).toHaveBeenCalledWith(
        '/config/cud-nxt-context.json',
        expectedContents,
        { encoding: 'utf-8'});
    });
  });
});
