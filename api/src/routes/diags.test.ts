import { getMockedFastifyApp, getMockedFastifyReply, getMockedRequestWithDeviceIdParameter } from '../helpers/testing/mockObjects';
import { diags, diagsForDevice } from '../services/diags/diags';
import { diagsRoutes } from './diags';

jest.mock('../services/diags/diags');

const diagsMock = diags as jest.Mock;
const diagsForDeviceMock = diagsForDevice as jest.Mock;

describe('diagnostics API routes', () => {
  const mockedApp = getMockedFastifyApp();
  const mockedRequest = getMockedRequestWithDeviceIdParameter('0');
  const mockedReply = getMockedFastifyReply(jest.fn(), jest.fn());

  beforeEach(() => {
    diagsMock.mockReset();
    diagsForDeviceMock.mockReset();
  });

  describe('diagsRoutes function', () => {
    it('should register diagnostics routes correctly', () => {
      // given-when
      diagsRoutes(mockedApp);

      // then
      expect(mockedApp.get).toHaveBeenCalledWith('/diags', expect.any(Function));
      expect(mockedApp.get).toHaveBeenCalledWith('/diags/:deviceId', expect.any(Function));
    });

    it('should call corresponding services', () => {
      // given
      (mockedApp.get as jest.Mock).mockImplementation((_path, getCallback) => {
        getCallback(mockedRequest, mockedReply);
      });

      // when
      diagsRoutes(mockedApp);

      // then
      expect(diagsMock).toHaveBeenCalledWith(mockedReply);
      expect(diagsForDeviceMock).toHaveBeenCalledWith('0', mockedReply);
    });
  });
});
