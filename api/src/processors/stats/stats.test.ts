import subSeconds from 'date-fns/subSeconds';
import { AppContext } from '../../common/context';
import { stats } from './stats';

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
  describe('stats function', () => {
    it('should compute stats into context', async () => {
      // given
      const { appInfo } = AppContext.get();
      appInfo.lastStartOn = NOW_MINUS_1MIN;
      appInfo.initialUptimeSeconds = 60;

      // when
      await stats();

      // then
      const { statistics } = AppContext.get();
      expect(statistics).toEqual({
        global: {
          appUptimeSeconds: {
            current: 60,
            overall: 120,
          },
        },
        perDevice: {
          '0': {
            uptimeSeconds: {
              current: 0,
              overall: 0,
            },
          },
        },
      });
    });

    it('should compute stats into context when last start on and initial uptime not available', async () => {
      // given-when
      await stats();

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