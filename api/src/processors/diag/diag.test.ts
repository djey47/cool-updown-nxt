import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';
import { FeatureStatus } from '../../models/common';
import { stats } from '../stats/stats';
import { diag } from './diag';
import { pingDiag } from './items/ping';
import { FeatureDiagnosticsResults } from './models/diag';

jest.useFakeTimers();

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
jest.mock('../stats/stats', () => ({
  stats: jest.fn(), 
}));

const coreLoggerInfoMock = coreLogger.info as jest.Mock<void>;
const recallMock = recall as jest.Mock<void>;
const pingDiagMock = pingDiag as jest.Mock<Promise<FeatureDiagnosticsResults>>;
const statsProcessorMock = stats as jest.Mock<Promise<void>>;

beforeEach(() => {
  coreLoggerInfoMock.mockReset();
  pingDiagMock.mockReset();
  recallMock.mockReset();
  statsProcessorMock.mockReset();

  AppContext.resetAll();
})

const NOW = new Date();

describe('diagnostics processor', () => {
  describe('diag function', () => {
    it('should write logs, perform diagnostics, perform stats and invoke recaller to call itself again', async () => {
      // given
      const results: FeatureDiagnosticsResults = {
        on: new Date(),
        status: FeatureStatus.OK,
      };
      pingDiagMock.mockResolvedValue(results);

      // when
      await diag();

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

      expect(coreLoggerInfoMock).toHaveBeenCalledTimes(2);
      expect(recallMock).toHaveBeenCalledWith(diag, 0);
      expect(statsProcessorMock).toHaveBeenCalledTimes(1);
    });

    it('should update diagnostics in context on a next call', async () => {
      // given
      const previousDate = new Date(2023, 0, 1);
      const appContext = AppContext.get();
      appContext.diagnostics[0] = {        
        on: previousDate,
        ping: {
          current: {
            on: previousDate,
            status: FeatureStatus.OK,
          },
        }
      };
      const results: FeatureDiagnosticsResults = {
        on: NOW,
        status: FeatureStatus.KO,
      };
      pingDiagMock.mockResolvedValue(results);

      // when
      await diag();

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
        }
      });

      expect(coreLoggerInfoMock).toHaveBeenCalledTimes(2);
      expect(recallMock).toHaveBeenCalledWith(diag, 0);
    });
  });
});