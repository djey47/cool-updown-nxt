import globalMocks from '../../config/jest/globalMocks';
import resetMocks from '../../config/jest/resetMocks';
import { FeatureStatus, PowerStatus } from '../models/common';
import { LastPowerAttemptReason } from '../processors/diag/models/diag';
import { AppContext } from './context';
import { coreLogger } from './logger';

import type { PersistedContext } from '../models/context';

const { appRootDirMock, node: { fsMock } } = globalMocks;

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
  });
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
            status: FeatureStatus.OK,
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
      AppContext.resetAll();

      // then
      expect(AppContext.get()).toEqual({
        appInfo: {},
        diagnostics: {
          '0': {
            ping: {
              status: 'n/a',
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
            ssh: {
              status: 'n/a',
            },
            http: {
              status: 'n/a',
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
        schedules: [{
          deviceIds: ['0'],
          enabled: false,
          id: 'sch-0',
          cronJobs: {},
        }],
      });
    });
  });

  describe('persist static method', () => {
    it('should write context to file asynchronously', async () => {
      // given
      AppContext.get().appInfo.lastStartOn = NOW;

      // when
      await AppContext.persist();

      // then
      const expectedContents = JSON.stringify({
        meta: {
          persistedOn: NOW,
        },
        contents: AppContext.get(),
      }, null, 2);
      expect(fsMock.writeFile).toHaveBeenCalledWith(
        '/config/cud-nxt-context.json',
        expectedContents,
        { encoding: 'utf-8' });
    });
  });

  describe('restore static method', () => {
    it('should read context from existing file', async () => {
      // given
      const persistedContext: PersistedContext = {
        meta: {
          persistedOn: NOW,
        },
        contents: {
          ...AppContext.get(),
          appInfo: {},
        },
      };
      const persistedContextAsString = JSON.stringify(persistedContext);
      fsMock.stat.mockResolvedValue({
        isFile: () => true,
      });
      fsMock.readFile.mockResolvedValue(persistedContextAsString);

      // when
      await AppContext.restore();

      // then
      const actualContext = AppContext.get();
      expect(actualContext).toEqual(persistedContext.contents);
    });

    it('should handle missing file correctly', async () => {
      // given
      fsMock.stat.mockRejectedValue('file not found');
      const initialContext: AppContext = {
        ...AppContext.get(),
      };

      // when
      await AppContext.restore();

      // then
      const actualContext = AppContext.get();
      expect(actualContext).toEqual(initialContext);
    });
  });
});
