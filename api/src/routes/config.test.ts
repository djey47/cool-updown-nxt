import { getMockedFastifyApp, getMockedFastifyReply, getMockedRequestWithDeviceIdParameter } from '../helpers/testing/mockObjects';
import { config, configForDevice } from '../services/config/config';
import { configRoutes } from './config';

jest.mock('../services/config/config');

const configMock = config as jest.Mock;
const configForDeviceMock = configForDevice as jest.Mock;

describe('config API routes', () => {
  const mockedApp = getMockedFastifyApp();
  const mockedRequest = getMockedRequestWithDeviceIdParameter('0');
  const mockedReply = getMockedFastifyReply(jest.fn(), jest.fn());

  beforeEach(() => {
    configMock.mockReset();
    configForDeviceMock.mockReset();
  });

  describe('configRoutes function', () => {
    it('should register config routes correctly', () => {
      // given-when
      configRoutes(mockedApp);

      // then
      expect(mockedApp.get).toHaveBeenCalledWith('/config', expect.any(Function));
      expect(mockedApp.get).toHaveBeenCalledWith('/config/:deviceId', expect.any(Function));
    });

    it('should call corresponding services', () => {
      // given
      (mockedApp.get as jest.Mock).mockImplementation((_path, getCallback) => {
        getCallback(mockedRequest, mockedReply);
      });

      // when
      configRoutes(mockedApp);

      // then
      expect(configMock).toHaveBeenCalledWith(mockedReply);
      expect(configForDeviceMock).toHaveBeenCalledWith('0', mockedReply);
    });
  });
});
