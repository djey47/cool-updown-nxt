import { schedules, schedulesForDevice } from './schedules';
import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getDefaultContext, getDefaultDeviceConfig, getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { validateDeviceIdentifier } from '../common/validators';

import type { DeviceConfig } from '../../models/configuration';
import type { SchedulesResponse } from './models/schedules';
import type { Context } from '../../models/context';

jest.mock('../common/validators');
jest.mock('../../common/api');
jest.mock('../../common/context');

const replyWithJsonMock = replyWithJson as jest.Mock;
const mockGetContextWithoutInternals = AppContext.getWithoutInternals as jest.Mock<Context, []>;
const validateDeviceIdentifierMock = validateDeviceIdentifier as jest.Mock<DeviceConfig, [string]>;

beforeEach(() => {
  replyWithJsonMock.mockReset();
  mockGetContextWithoutInternals.mockReset();
  validateDeviceIdentifierMock.mockReset();
});

describe('Schedules service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);
  const defaultContext = getDefaultContext();
  const defaultDeviceConfiguration = getDefaultDeviceConfig();
  const contextWithSchedule: Context = {
    ...defaultContext,
    schedules: [{
      id: 'sch-0',
      cronJobs: {},
      deviceIds: ['0'],
      enabled: false,
      powerOnCron: '* * * * *',
      powerOffCron: '* * * * *',
    }, {
      id: 'sch-1',
      cronJobs: {},
      deviceIds: ['1'],
      enabled: true,
      powerOnCron: '0 0 * * *',
      powerOffCron: '30 0 * * *',
    }],
  };

  describe('schedules function', () => {
    it('should reply with all schedules as JSON', () => {
      // given
      mockGetContextWithoutInternals.mockReturnValue({ ...contextWithSchedule });

      // when
      schedules(defaultReply);

      // then
      const expectedOutput: SchedulesResponse = {
        schedules: {
          'sch-0': {
            deviceIds: ['0'],
            enabled: false,
            powerOnCron: '* * * * *',
            powerOffCron: '* * * * *',
          },
          'sch-1': {
            deviceIds: ['1'],
            enabled: true,
            powerOnCron: '0 0 * * *',
            powerOffCron: '30 0 * * *',
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });
  });

  describe('schedulesForDevice function', () => {
    it('should provide schedules as JSON for existing device', () => {
      // given
      mockGetContextWithoutInternals.mockReturnValue({ ...contextWithSchedule });
      validateDeviceIdentifierMock.mockReturnValue(defaultDeviceConfiguration);

      // when
      schedulesForDevice('0', defaultReply);

      // then
      const expectedOutput: SchedulesResponse = {
        schedules: {
          'sch-0': {
            deviceIds: ['0'],
            enabled: false,
            powerOnCron: '* * * * *',
            powerOffCron: '* * * * *',
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should provide schedules as JSON for existing device, having no schedule', () => {
      // given
      validateDeviceIdentifierMock.mockReturnValue(defaultDeviceConfiguration);
      mockGetContextWithoutInternals.mockReturnValue({ ...defaultContext });

      // when
      schedulesForDevice('1', defaultReply);

      // then
      const expectedOutput: SchedulesResponse = {
        schedules: {},
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should not reply when no config for specified device', () => {
      // given-when
      schedulesForDevice('0', defaultReply);

      // then
      expect(replyWithJsonMock).not.toHaveBeenCalled();
    });
  });
});
