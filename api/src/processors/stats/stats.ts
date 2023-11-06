import differenceInSeconds from 'date-fns/differenceInSeconds/index.js';
import { getConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';

import type { DeviceConfig } from '../../models/configuration';
import type { DeviceDiagnosticsContext, DeviceStatisticsContext } from '../../models/context';

export async function statsProcessor() {
  coreLogger.info('stats::stats Performing...');

  statsForApplication();

  statsForAllDevices();

  coreLogger.info('stats::stats Done!');
}

function statsForApplication() {
  // Update context
  const { appInfo: { lastStartOn, initialUptimeSeconds }, statistics } = AppContext.get();

  const now = new Date();
  const currentUptime = differenceInSeconds(now, lastStartOn || now);

  statistics.global = {
    appUptimeSeconds: {
      current: currentUptime,
      overall: (initialUptimeSeconds || 0) + currentUptime,
    },
  };

}

function statsForAllDevices() {
  // Update context
  const { statistics, diagnostics } = AppContext.get();

  const devicesConfigs = getConfig().get('devices') as DeviceConfig[];
  devicesConfigs.forEach(( dc, index) => {
    const deviceId = String(index);
    const deviceDiagnostics = diagnostics[deviceId];
    statistics.perDevice[deviceId] = statsByDevice(deviceId, dc, deviceDiagnostics);
  });
}

function statsByDevice(deviceId: string, deviceConfig: DeviceConfig, deviceDiagnostics: DeviceDiagnosticsContext): DeviceStatisticsContext {
  // TODO Implement
  return {
    uptimeSeconds: {
      current: 0,
      overall: 0,
    },
  };
}
