import { replyWithItemNotFound, replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getDefaultContext, getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { stats, statsForDevice } from './stats';
import { ApiItem } from '../../models/api';

import type { StatsResponse } from './models/stats';
import type { Context, StatisticsContext } from '../../models/context';

jest.mock('../../common/api');
jest.mock('../../common/context');

const replyWithJsonMock = replyWithJson as jest.Mock;
const replyWithItemNotFoundMock = replyWithItemNotFound as jest.Mock;
const contextGetMock = AppContext.get as jest.Mock<Context, []>;

beforeEach(() => {
  replyWithJsonMock.mockReset();
  replyWithItemNotFoundMock.mockReset();
  contextGetMock.mockReset();
});

describe('stats service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);
  const defaultContext = getDefaultContext();
  const defaultStats: StatisticsContext = {
    global: {
      appUptimeSeconds: {
        current: 25,
        overall: 50,
      },
    },
    perDevice: {
      '0': {
        uptimeSeconds: {
          current: 10,
          overall: 20,
        },
      },
      '1': {
        uptimeSeconds: {
          current: 30,
          overall: 40,
        },
      },
    }
  };

  describe('stats async function', () => {
    it('should send current stats results for all devices', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
        statistics: defaultStats,
      });

      // when
      await stats(defaultReply);

      // then
      const expectedOutput: StatsResponse = {
        statistics: {
          app: {
            uptimeSeconds: {
              current: 25,
              overall: 50,
            },
          },
          perDevice: {
            '0': {
              uptimeSeconds: {
                current: 10,
                overall: 20,
              },
            },
            '1': {
              uptimeSeconds: {
                current: 30,
                overall: 40,
              },
            },
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should send current stats results when app uptime info not available', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
      });

      // when
      await stats(defaultReply);

      // then
      const expectedOutput: StatsResponse = {
        statistics: {
          app: {
            uptimeSeconds: {
              current: 0,
              overall: 0,
            },
          },
          perDevice: {},
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });
  });

  describe('statsForDevice async function', () => {
    it('should send current stats result for specified device', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
        statistics: defaultStats,
      });

      // when
      await statsForDevice('0', defaultReply);

      // then
      const expectedOutput: StatsResponse = {
        statistics: {
          uptimeSeconds: {
            current: 10,
            overall: 20,
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should reply with 404 when no stats for specified device', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
        statistics: defaultStats,
      });

      // when
      await statsForDevice('foo', defaultReply);

      // then
      expect(replyWithJsonMock).not.toHaveBeenCalled();
      expect(replyWithItemNotFound).toHaveBeenCalledWith(defaultReply, ApiItem.DEVICE_ID, 'foo');
    });
  });
});
