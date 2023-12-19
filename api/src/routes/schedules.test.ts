import { getMockedFastifyApp, getMockedFastifyReply, getMockedRequestWithDeviceIdParameter } from '../helpers/testing/mockObjects';
import { schedules, schedulesForDevice } from '../services/schedules/schedules';
import { schedulesRoutes } from './schedules';

import type { FastifyReply } from 'fastify/types/reply';

jest.mock('../services/schedules/schedules');

const schedulesMock = schedules as jest.Mock<void, [FastifyReply]>;
const schedulesForDeviceMock = schedulesForDevice as jest.Mock<void, [string, FastifyReply]>;

describe('schedules API routes', () => {
  const mockedApp = getMockedFastifyApp();
  const mockedRequest = getMockedRequestWithDeviceIdParameter('0');
  const mockedReply = getMockedFastifyReply(jest.fn(), jest.fn());

  beforeEach(() => {
    schedulesMock.mockReset();
    schedulesForDeviceMock.mockReset();
  });

  describe('schedules function', () => {
    it('should register config routes correctly', () => {
      // given-when
      schedulesRoutes(mockedApp);

      // then
      expect(mockedApp.get).toHaveBeenCalledWith('/schedules', expect.any(Function));
      expect(mockedApp.get).toHaveBeenCalledWith('/device-schedules/:deviceId', expect.any(Function));
    });

    it('should call corresponding services', () => {
      // given
      (mockedApp.get as jest.Mock).mockImplementation((_path, getCallback) => {
        getCallback(mockedRequest, mockedReply);
      });

      // when
      schedulesRoutes(mockedApp);

      // then
      expect(schedulesMock).toHaveBeenCalledWith(mockedReply);
      expect(schedulesForDeviceMock).toHaveBeenCalledWith('0', mockedReply);
    });
  });
});
