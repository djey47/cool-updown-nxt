import { getMockedFastifyApp, getMockedFastifyReply, getMockedRequestWithDeviceIdParameter } from '../helpers/testing/mockObjects';
import { home } from '../services/home/home';
import { rootRoutes } from './root';

jest.mock('../services/home/home');

const homeMock = home as jest.Mock;

describe('root API routes', () => {
  const mockedApp = getMockedFastifyApp();
  const mockedRequest = getMockedRequestWithDeviceIdParameter('0');
  const mockedReply = getMockedFastifyReply(jest.fn(), jest.fn());

  beforeEach(() => {
    homeMock.mockReset();
  });

  describe('rootRoutes function', () => {
    it('should register root routes correctly', () => {
      // given-when
      rootRoutes(mockedApp);

      // then
      expect(mockedApp.get).toHaveBeenCalledWith('/', expect.any(Function));
    });

    it('should call corresponding services', () => {
      // given
      (mockedApp.get as jest.Mock).mockImplementation((_path, getCallback) => {
        getCallback(mockedRequest, mockedReply);
      });

      // when
      rootRoutes(mockedApp);

      // then
      expect(homeMock).toHaveBeenCalledWith(mockedReply);
    });
  });
});
