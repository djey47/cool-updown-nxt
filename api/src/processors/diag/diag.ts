import { getConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';
import { statsProcessor } from '../stats/stats';
import { pingDiag } from './items/ping';
import { powerDiag } from './items/power';

import type { DiagResults } from './models/diag';
import type { DeviceConfig } from '../../models/configuration';

const DIAGS_INTERVAL = getConfig().app.diagnosticsIntervalMs;

export async function diagProcessor() {
  // Will log to console only as using core logger (pino)
  coreLogger.info('diag::diag Performing...');

  const devicesConfig = getConfig().get('devices') as DeviceConfig[];

  await diagForAllDevices(devicesConfig);

  coreLogger.info('diag::diag Done!');

  // Stats are computed once diags are done
  await statsProcessor();

  recall(diagProcessor, DIAGS_INTERVAL);
}

async function diagForAllDevices(devicesConfigs: DeviceConfig[]) {
  // For now device id is the rank in configuration array...
  const diagPromises = devicesConfigs.map((dc, index) => diagByDevice(String(index), dc));
  const allResults = await Promise.all(diagPromises);

  // Update context
  const appContext = AppContext.get();
  allResults.forEach((result) => {
    const { deviceId, ping: pingResult } = result;
    const deviceDiags = appContext.diagnostics[deviceId] || { ping: {} };
    appContext.diagnostics[deviceId] = deviceDiags;

    // Previous diagnostics
    deviceDiags.previous = {
      on: deviceDiags.on,
      ping: { ...deviceDiags.ping },
      power: { ...deviceDiags.power },
    };

    // Current diagnostics
    const currentDate = new Date();
    deviceDiags.on = currentDate;

    // Ping
    // FIXME Use previous diags instead, assume current by default (simplify model)
    deviceDiags.ping = {
      current: pingResult.current,
      previous: deviceDiags.ping.current,
    };

    // Power state
    deviceDiags.power = powerDiag(deviceDiags);
  });
}

async function diagByDevice(deviceId: string, deviceConfig: DeviceConfig): Promise<DiagResults> {
  const pingResults = await pingDiag(deviceId, deviceConfig);
  
  return {
    deviceId,
    ping: {
      current: pingResults,
    },
  };
}
