import { getMockedFastifyApp, getMockedFastifyReply, getMockedRequestWithDeviceIdParameter } from '../helpers/testing/mockObjects';
import { stats, statsForDevice } from '../services/stats/stats';
import { statsRoutes } from './stats';

jest.mock('../services/stats/stats');

const statsMock = stats as jest.Mock;
const statsForDeviceMock = statsForDevice as jest.Mock;

describe('statistics API routes', () => {
  const mockedApp = getMockedFastifyApp();
  const mockedRequest = getMockedRequestWithDeviceIdParameter('0');
  const mockedReply = getMockedFastifyReply(jest.fn(), jest.fn());

  beforeEach(() => {
    statsMock.mockReset();
    statsForDeviceMock.mockReset();
  });

  describe('statsRoutes function', () => {
    it('should register diagnostics routes correctly', () => {
      // given-when
      statsRoutes(mockedApp);

      // then
      expect(mockedApp.get).toHaveBeenCalledWith('/stats', expect.any(Function));
      expect(mockedApp.get).toHaveBeenCalledWith('/stats/:deviceId', expect.any(Function));
    });

    it('should call corresponding services', () => {
      // given
      (mockedApp.get as jest.Mock).mockImplementation((_path, getCallback) => {
        getCallback(mockedRequest, mockedReply);
      });

      // when
      statsRoutes(mockedApp);

      // then
      expect(statsMock).toHaveBeenCalledWith(mockedReply);
      expect(statsForDeviceMock).toHaveBeenCalledWith('0', mockedReply);
    });
  });
});
