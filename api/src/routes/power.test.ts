import { getMockedFastifyApp, getMockedFastifyReply, getMockedRequestWithDeviceIdParameter } from '../helpers/testing/mockObjects';
import { powerOffForDevice } from '../services/power/powerOff';
import { powerOnForDevice } from '../services/power/powerOn';
import { powerRoutes } from './power';

jest.mock('../services/power/powerOn');
jest.mock('../services/power/powerOff');

const powerOnForDeviceMock = powerOnForDevice as jest.Mock;
const powerOffForDeviceMock = powerOffForDevice as jest.Mock;

describe('power API routes', () => {
  const mockedApp = getMockedFastifyApp();
  const mockedRequest = getMockedRequestWithDeviceIdParameter('0');
  const mockedReply = getMockedFastifyReply(jest.fn(), jest.fn());

  beforeEach(() => {
    powerOnForDeviceMock.mockReset();
    powerOffForDeviceMock.mockReset();
  });

  describe('powerRoutes function', () => {
    it('should register power routes correctly', () => {
      // given-when
      powerRoutes(mockedApp);

      // then
      expect(mockedApp.post).toHaveBeenCalledWith('/power-on/:deviceId', expect.any(Function));
      expect(mockedApp.post).toHaveBeenCalledWith('/power-off/:deviceId', expect.any(Function));
    });

    it('should call corresponding services', () => {
      // given
      (mockedApp.post as jest.Mock).mockImplementation((_path, postCallback) => {
        postCallback(mockedRequest, mockedReply);
      });

      // when
      powerRoutes(mockedApp);

      // then
      expect(powerOnForDeviceMock).toHaveBeenCalledWith('0', mockedReply);
      expect(powerOffForDeviceMock).toHaveBeenCalledWith('0', mockedReply);
    });
  });
});
