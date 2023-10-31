import differenceInSeconds from 'date-fns/differenceInSeconds';
import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';

import type { FastifyReply } from 'fastify';
import type { AppInfoContext, StatisticsContext } from '../../models/context';
import type { StatsResponse, StatsResponseForAllDevices, StatsResponseForApp, StatsResponseForDevice } from './models/stats';

/** 
 * Statistics service implementation
 */
export async function stats(reply: FastifyReply) {
  const appContext = AppContext.get();

  const { statistics, appInfo } = appContext;

  const output: StatsResponse = {
    statistics: {
      app: globalStatsContextToResponse(appInfo),
      perDevice: statsContextToResponse(statistics),
    },
  };

  replyWithJson(reply, output);
}

function globalStatsContextToResponse(appInfo: AppInfoContext): StatsResponseForApp {
  const now = new Date();
  const currentUptime = differenceInSeconds(now, appInfo.lastStartOn || now);
  return {
    uptimeSeconds: {
      current: currentUptime,
      overall: (appInfo.initialUptimeSeconds || 0) + currentUptime,
    }
  };
}

function statsContextToResponse(statsContext: StatisticsContext): StatsResponseForAllDevices {
  return Object.entries(statsContext.perDevice)
    .sort(([deviceId1], [deviceId2]) => deviceId1.localeCompare(deviceId2))
    .reduce((acc: StatsResponseForAllDevices, [deviceId, deviceStats]) => {
      const { uptime: { current: currentUptime, overall: overallUptime } } = deviceStats;
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
