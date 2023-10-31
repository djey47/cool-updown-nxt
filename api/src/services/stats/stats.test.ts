import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { stats } from './stats';

import type { StatsResponse } from './models/stats';

jest.mock('../../common/api');
const replyWithJsonMock = replyWithJson as jest.Mock;

beforeEach(() => {
  replyWithJsonMock.mockReset();
});

describe('stats service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  afterEach(() => {
    AppContext.resetAll();
  });

  describe('stats async function', () => {
    it('should send current stats results for all devices', async () => {
      // given
      const appContext = AppContext.get();
      appContext.statistics = {
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
      const appContext = AppContext.get();
      appContext.statistics = {
        global: {},
        perDevice: {}
      };

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
});
