import globalMocks from '../../config/jest/globalMocks';
import { ScheduleConfig } from '../models/configuration';
import { initPowerCronJobs } from './cron';
import { powerOnForDevicesScheduled } from '../services/power/powerOn';
import { powerOffForDevicesScheduled } from '../services/power/powerOff';
import resetMocks from '../../config/jest/resetMocks';

jest.mock('../services/power/powerOn');
jest.mock('../services/power/powerOff');

const { cronMock: { Job: JobMock, start: startJobMock }} = globalMocks;
const powerOnForDevicesScheduledMock = powerOnForDevicesScheduled as jest.Mock<Promise<void>, [string[]]>;
const powerOffForDevicesScheduledMock = powerOffForDevicesScheduled as jest.Mock<Promise<void>, [string[]]>;

beforeEach(() => {
  resetMocks();
  powerOnForDevicesScheduledMock.mockReset();
  powerOffForDevicesScheduledMock.mockReset();
});

describe('cron scheduling helper', () => {
  describe('initPowerCronJobs function', () => {
    const baseScheduleConfig: ScheduleConfig = {
      deviceIds: ['0'],
      enabled: false,
      powerOnCron: '4 4 * * *',
      powerOffCron: '5 4 * * *'
    };

    it('should return cron jobs with correct power ON/OFF callbacks, scheduling disabled', () => {
      // given
      const scheduleConfig: ScheduleConfig = { ...baseScheduleConfig };

      // when
      const actualJobs = initPowerCronJobs(scheduleConfig);

      // then
      expect (actualJobs).toHaveLength(2);
      expect(actualJobs[0]).not.toBeUndefined();
      expect(actualJobs[1]).not.toBeUndefined();

      expect(JobMock).toHaveBeenCalledTimes(2);
      expect(JobMock).toHaveBeenCalledWith('4 4 * * *', expect.any(Function));
      expect(JobMock).toHaveBeenCalledWith('5 4 * * *', expect.any(Function));
      
      const [[_0, onCallback],[_1, offCallback]] = JobMock.mock.calls;
      onCallback();
      offCallback();
      expect(powerOnForDevicesScheduledMock).toHaveBeenCalledWith(['0']);
      expect(powerOffForDevicesScheduledMock).toHaveBeenCalledWith(['0']);

      expect(startJobMock).not.toHaveBeenCalled();
    });    

    it('should start cron jobs, scheduling enabled', () => {
      // given
      const scheduleConfig: ScheduleConfig = {
        ...baseScheduleConfig,
        enabled: true,
      };

      // when
      const actualJobs = initPowerCronJobs(scheduleConfig);

      // then
      expect (actualJobs).toHaveLength(2);
      expect(actualJobs[0]).not.toBeUndefined();
      expect(actualJobs[1]).not.toBeUndefined();

      expect(JobMock).toHaveBeenCalledTimes(2);
   
      expect(startJobMock).toHaveBeenCalledTimes(2);
    });    
    
    it('should return undefined jobs when cron spec is not provided', () => {
      // given
      const {
        powerOnCron: _on,
        powerOffCron: _off,
        ...scheduleConfig
      } = baseScheduleConfig;

      // when
      const actualJobs = initPowerCronJobs(scheduleConfig);

      // then
      expect (actualJobs).toHaveLength(2);
      expect(actualJobs[0]).toBeUndefined();
      expect(actualJobs[1]).toBeUndefined();

      expect(JobMock).not.toHaveBeenCalled();
    });
  });
});