import { schedules, schedulesForDevice } from './schedules';
import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getDefaultContext, getDefaultDeviceConfig, getMockedCronJob, getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { validateDeviceIdentifier } from '../common/validators';

import type { DeviceConfig } from '../../models/configuration';
import type { SchedulesResponse } from './models/schedules';
import type { Context, ScheduleContext } from '../../models/context';
import formatISO from 'date-fns/formatISO/index.js';

jest.mock('../common/validators');
jest.mock('../../common/api');
jest.mock('../../common/context');

const defaultJob = getMockedCronJob();
const lastDateMock = defaultJob.lastDate as jest.Mock<Date, []>;
const nextDateMock = defaultJob.nextDate as jest.Mock;
const replyWithJsonMock = replyWithJson as jest.Mock;
const mockGetContext = AppContext.get as jest.Mock<Context, []>;
const validateDeviceIdentifierMock = validateDeviceIdentifier as jest.Mock<DeviceConfig, [string]>;

const NOW = new Date();
const NOW_DATETIME = {
  toJSDate: () => NOW,
};

beforeEach(() => {
  replyWithJsonMock.mockReset();
  mockGetContext.mockReset();
  validateDeviceIdentifierMock.mockReset();
  lastDateMock.mockReset();
  nextDateMock.mockReset();

  lastDateMock.mockReturnValue(NOW);
  nextDateMock.mockReturnValue(NOW_DATETIME);

  defaultJob.running = true;
});

describe('Schedules service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);
  const defaultContext = getDefaultContext();
  const defaultDeviceConfiguration = getDefaultDeviceConfig();
  const scheduleForPowerOn: ScheduleContext = {
    id: 'sch-0',
    cronJobs: {
      powerOnJob: defaultJob,
    },
    deviceIds: ['0'],
    enabled: false,
    powerOnCron: '* * * * *',
    powerOffCron: '* * * * *',
  };
  const scheduleForPowerOff: ScheduleContext = {
    ...scheduleForPowerOn,
    cronJobs: {
      powerOffJob: defaultJob,
    },
  };

  describe('schedules function', () => {
    const contextWithSchedule: Context = {
      ...defaultContext,
      schedules: [{
        ...scheduleForPowerOn,
      }, {
        id: 'sch-1',
        cronJobs: {},
        deviceIds: ['1'],
        enabled: true,
        powerOnCron: '0 0 * * *',
        powerOffCron: '30 0 * * *',
      }],
    };

    it('should reply with all schedules as JSON', () => {
      // given
      mockGetContext.mockReturnValue({ ...contextWithSchedule });

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
            powerOnExecDates: {
              last: formatISO(NOW),
              next: formatISO(NOW),
            },
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
    const contextWithSchedule: Context = {
      ...defaultContext,
      schedules: [{
        ...scheduleForPowerOff,
      }, {
        id: 'sch-1',
        cronJobs: {},
        deviceIds: ['1'],
        enabled: true,
        powerOnCron: '0 0 * * *',
        powerOffCron: '30 0 * * *',
      }],
    };

    it('should provide schedules as JSON for existing device', () => {
      // given
      mockGetContext.mockReturnValue({ ...contextWithSchedule });
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
            powerOffExecDates: {
              last: formatISO(NOW),
              next: formatISO(NOW),
            },
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should provide schedules as JSON for existing device, having no schedule', () => {
      // given
      validateDeviceIdentifierMock.mockReturnValue(defaultDeviceConfiguration);
      mockGetContext.mockReturnValue({ ...defaultContext });

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
