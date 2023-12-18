import { CronJob } from 'cron';
import { powerOnForDevicesScheduled } from '../services/power/powerOn';
import { powerOffForDevicesScheduled } from '../services/power/powerOff';

import type { ScheduleConfig } from '../models/configuration';

export function initPowerCronJobs(scheduleConfig: ScheduleConfig) {
  const { deviceIds, powerOnCron, powerOffCron } = scheduleConfig;
  const powerOnCallback = async () => {
    await powerOnForDevicesScheduled(deviceIds);
  };
  const powerOffCallback = async () => {
    await powerOffForDevicesScheduled(deviceIds);
  };
  const powerOnJob = powerOnCron ?
    new CronJob(powerOnCron, powerOnCallback) : undefined;
  if (powerOnJob && scheduleConfig.enabled) {
    powerOnJob.start();
  }
  const powerOffJob = powerOffCron ?
    new CronJob(powerOffCron, powerOffCallback) : undefined;
  if (powerOffJob && scheduleConfig.enabled) {
    powerOffJob.start();
  }
  return [powerOnJob, powerOffJob];
}
