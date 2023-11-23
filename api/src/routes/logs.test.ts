import { FastifyReply } from 'fastify/types/reply';
import { getMockedFastifyApp, getMockedFastifyReply, getMockedRequestWithLogsQueryParameters } from '../helpers/testing/mockObjects';
import { logs } from '../services/logs/logs';
import { logsRoutes } from './logs';

jest.mock('../services/logs/logs');

const logsMock = logs as jest.Mock<Promise<void>, [number | undefined, FastifyReply]>;

describe('logs API routes', () => {
  const mockedApp = getMockedFastifyApp();
  const mockedRequest = getMockedRequestWithLogsQueryParameters();
  const mockedRequestWithLimitation = getMockedRequestWithLogsQueryParameters(100);
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

    it('should call corresponding service', () => {
      // given
      (mockedApp.get as jest.Mock).mockImplementation((_path, getCallback) => {
        getCallback(mockedRequest, mockedReply);
      });

      // when
      logsRoutes(mockedApp);

      // then
      expect(logsMock).toHaveBeenCalledWith(undefined, mockedReply);
    });

    it('should call corresponding service with event limitation', () => {
      // given
      (mockedApp.get as jest.Mock).mockImplementation((_path, getCallback) => {
        getCallback(mockedRequestWithLimitation, mockedReply);
      });

      // when
      logsRoutes(mockedApp);

      // then
      expect(logsMock).toHaveBeenCalledWith(100, mockedReply);
    });
  });
});
