import { replyWithItemNotFound, replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';

import type { FastifyReply } from 'fastify';
import type { DeviceStatisticsContext, GlobalStatisticsContext, StatisticsContext } from '../../models/context';
import type { StatsResponse, StatsResponseForAllDevices, StatsResponseForApp, StatsResponseForDevice } from './models/stats';
import { ApiItem } from '../../models/api';

/** 
 * Statistics service implementation: for all configured devices
 */
export async function stats(reply: FastifyReply) {
  const appContext = AppContext.get();

  const { statistics } = appContext;

  const output: StatsResponse = {
    statistics: {
      app: globalStatsContextToResponse(statistics.global),
      perDevice: statsContextToResponse(statistics),
    },
  };

  replyWithJson(reply, output);
}

/** 
 * Statistics service implementation: for a specified device
 */
export async function statsForDevice(deviceId: string, reply: FastifyReply) {
  const appContext = AppContext.get();
  const { statistics } = appContext;

  const deviceStats = statistics.perDevice[deviceId];
  if (!deviceStats) {
    replyWithItemNotFound(reply, ApiItem.DEVICE_ID, deviceId);
    return;
  }

  const output: StatsResponse = {
    statistics: statsContextForDeviceToResponse(deviceStats),
  }
  
  replyWithJson(reply, output);  
}

function globalStatsContextToResponse(statsContext: GlobalStatisticsContext): StatsResponseForApp {
  const { appUptimeSeconds } = statsContext;
  return {
    uptimeSeconds: {
      current: appUptimeSeconds?.current || 0,
      overall: appUptimeSeconds?.overall || 0,
    },
  };
}

function statsContextToResponse(statsContext: StatisticsContext): StatsResponseForAllDevices {
  return Object.entries(statsContext.perDevice)
    .sort(([deviceId1], [deviceId2]) => deviceId1.localeCompare(deviceId2))
    .reduce((acc: StatsResponseForAllDevices, [deviceId, deviceStats]) => {
      acc[deviceId] = statsContextForDeviceToResponse(deviceStats);
      return acc;
    }, {});
}

function statsContextForDeviceToResponse(deviceStats: DeviceStatisticsContext): StatsResponseForDevice {
  const { uptimeSeconds: { current: currentUptime, overall: overallUptime } } = deviceStats;
  return {
    uptimeSeconds: {
      current: currentUptime,
      overall: overallUptime,
    },
  };
}
