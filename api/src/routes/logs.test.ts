import { getMockedFastifyApp, getMockedFastifyReply, getMockedRequestWithDeviceIdParameter } from '../helpers/testing/mockObjects';
import { logs } from '../services/logs/logs';
import { logsRoutes } from './logs';

jest.mock('../services/logs/logs');

const logsMock = logs as jest.Mock;

describe('logs API routes', () => {
  const mockedApp = getMockedFastifyApp();
  const mockedRequest = getMockedRequestWithDeviceIdParameter('0');
  const mockedReply = getMockedFastifyReply(jest.fn(), jest.fn());

  beforeEach(() => {
    logsMock.mockReset();
  });

  describe('logsRoutes function', () => {
    it('should register diagnostics routes correctly', () => {
      // given-when
      logsRoutes(mockedApp);

      // then
      expect(mockedApp.get).toHaveBeenCalledWith('/logs', expect.any(Function));
    });

    it('should call corresponding services', () => {
      // given
      (mockedApp.get as jest.Mock).mockImplementation((_path, getCallback) => {
        getCallback(mockedRequest, mockedReply);
      });

      // when
      logsRoutes(mockedApp);

      // then
      expect(logsMock).toHaveBeenCalledWith(mockedReply);
    });
  });
});
