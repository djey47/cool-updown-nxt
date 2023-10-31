import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';

import type { FastifyReply } from 'fastify';
import type { GlobalStatisticsContext, StatisticsContext } from '../../models/context';
import type { StatsResponse, StatsResponseForAllDevices, StatsResponseForApp, StatsResponseForDevice } from './models/stats';

/** 
 * Statistics service implementation
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
      const { uptimeSeconds: { current: currentUptime, overall: overallUptime } } = deviceStats;
      const resultEntry: StatsResponseForDevice = {
        uptimeSeconds: {
          current: currentUptime,
          overall: overallUptime,
        },
      };
      acc[deviceId] = resultEntry;
      return acc;
    }, {});
}
