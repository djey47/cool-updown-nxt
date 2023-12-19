import formatISO from 'date-fns/formatISO/index.js';
import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { validateDeviceIdentifier } from '../common/validators';

import type { FastifyReply } from 'fastify/types/reply';
import type { CronJobsContext, ScheduleContext } from '../../models/context';
import type { ScheduleEntries, PowerExecutionDates, SchedulesResponse } from './models/schedules';
import { CronJob } from 'cron';

/**
 * Provides all registered schedules 
 */
export function schedules(reply: FastifyReply) {
  const { schedules } = AppContext.get();

  replyWithScheduleEntries(schedules, reply);
}

/**
 * Provides schedules for device with provided deviceId
 */
export function schedulesForDevice(deviceId: string, reply: FastifyReply) {
  const deviceConfig = validateDeviceIdentifier(deviceId, reply);
  if (!deviceConfig) {
    return;
  }

  const { schedules } = AppContext.get();
  const schedulesForThisDevice = schedules.filter((sch) => sch.deviceIds.includes(deviceId));

  replyWithScheduleEntries(schedulesForThisDevice, reply);
}

function replyWithScheduleEntries(schedules: ScheduleContext[], reply: FastifyReply) {
  const output: SchedulesResponse = {
    schedules: scheduleContextToEntries(schedules),
  };
  replyWithJson(reply, output);
}

function scheduleContextToEntries(schedules: ScheduleContext[]) {
  return schedules
    .sort(({ id: id1 }, { id: id2 }) => id1.localeCompare(id2))
    .reduce<ScheduleEntries>((entries, sch) => {
      const { id, cronJobs, ...entry } = sch;
      entries[id] = {
        ...entry,
        ...extractPowerDates(cronJobs),
      };
      return entries;
    }, {});
}

function extractPowerDates(cronJobs: CronJobsContext) {
  const { powerOnJob, powerOffJob} = cronJobs;

  // console.log('(schedules::extractPowerDates)', { powerOnJob, powerOffJob });

  return {
    powerOnExecDates: powerOnJob && extractScheduleDates(powerOnJob),
    powerOffExecDates: powerOffJob && extractScheduleDates(powerOffJob),
  };
}

function extractScheduleDates(cronJob: CronJob): PowerExecutionDates {
  const lastDateValue = cronJob.lastDate();
  const nextDateValue = cronJob.nextDate();

  // console.log('(schedules::extractScheduleDates)', { lastDateValue, nextDateValue });

  return {
    last: !!lastDateValue && formatISO(lastDateValue) || undefined,
    next: formatISO(nextDateValue.toJSDate()),
  };
}