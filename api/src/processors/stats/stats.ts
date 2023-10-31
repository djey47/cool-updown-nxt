import { getConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';

import type { DeviceConfig } from '../../models/configuration';
import type { DeviceDiagnosticsContext, DeviceStatisticsContext } from '../../models/context';

export async function stats() {
  coreLogger.info('stats::stats Performing...');

  await statsForAllDevices();

  coreLogger.info('stats::stats Done!');
}

async function statsForAllDevices() {
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
  return {
    uptimeSeconds: {
      current: 0,
      overall: 0,
    },
  };
}
