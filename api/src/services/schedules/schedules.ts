import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';

import type { FastifyReply } from 'fastify/types/reply';
import type { ScheduleContext } from '../../models/context';
import { ScheduleEntries, type SchedulesResponse } from './models/schedules';
import { validateDeviceIdentifier } from '../common/validators';

/**
 * Provides all registered schedules 
 */
export function schedules(reply: FastifyReply) {
  const { schedules } = AppContext.getWithoutInternals();

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

  const { schedules } = AppContext.getWithoutInternals();
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
      const { id, cronJobs: _cj, ...entry } = sch;
      entries[id] = entry;
      return entries;
    }, {});
}
