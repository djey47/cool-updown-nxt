import differenceInSeconds from 'date-fns/differenceInSeconds/index.js';
import { getConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';

import type { DeviceConfig } from '../../models/configuration';
import type { DeviceDiagnosticsContext, DeviceStatisticsContext } from '../../models/context';
import { PowerStatus } from '../../models/common';

export async function statsProcessor() {
  coreLogger.info('stats::stats Performing...');

  statsForApplication();

  statsForAllDevices();

  coreLogger.info('stats::stats Done!');
}

function statsForApplication() {
  // Update context
  const { appInfo: { lastStartOn }, statistics } = AppContext.get();

  const now = new Date();
  const currentUptime = differenceInSeconds(now, lastStartOn || now);

  // console.log('stats::statsForApplication', { currentUptime, statistics: statistics.global }, );

  statistics.global = {
    appUptimeSeconds: {
      current: currentUptime,
      overall: (statistics.global.appUptimeSeconds?.overall || 0) + currentUptime, // FIXME should add to initial uptime (to be persisted?)
    },
  };

}

function statsForAllDevices() {
  // Update context
  const { statistics, diagnostics } = AppContext.get();

  const devicesConfigs = getConfig().get('devices') as DeviceConfig[];
  devicesConfigs.forEach((dc, index) => {
    const deviceId = String(index);
    const deviceDiagnostics = diagnostics[deviceId];
    statistics.perDevice[deviceId] = statsByDevice(
      deviceId,
      dc, 
      deviceDiagnostics, 
      statistics.perDevice[deviceId] || AppContext.createDefaultStatsForDevice());
  });
}

function statsByDevice(deviceId: string, deviceConfig: DeviceConfig, deviceDiagnostics: DeviceDiagnosticsContext, deviceStatistics: DeviceStatisticsContext): DeviceStatisticsContext {
  return {
    uptimeSeconds: computeUptimesByDevice(deviceDiagnostics, deviceStatistics),
  };
}

function computeUptimesByDevice(deviceDiags: DeviceDiagnosticsContext, deviceStats: DeviceStatisticsContext) {
  const { on: currentDiagsDate, power: powerDiags, previous: previousDiags } = deviceDiags;
  const { uptimeSeconds: { current: currentUptime, overall: overallUptime } } = deviceStats;

  let newCurrentUptime = currentUptime;
  let newOverallUptime = overallUptime;
  if (powerDiags.state === PowerStatus.ON && previousDiags?.power.state === PowerStatus.ON) {
    const now = new Date();
    const addedUptime = differenceInSeconds(currentDiagsDate || now, previousDiags?.on || now);

    newCurrentUptime = currentUptime + addedUptime;
    newOverallUptime += addedUptime; 
  } else {
    // If device is OFF, ensure current uptime is set to 0; global one should remain as it is
    newCurrentUptime = 0;
  }

  return {
    current: newCurrentUptime,
    overall: newOverallUptime,
  };
}