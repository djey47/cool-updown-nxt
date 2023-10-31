import { getConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';
import { FeatureStatus, PowerStatus } from '../../models/common';
import { stats } from '../stats/stats';
import { pingDiag } from './items/ping';
import type { DiagResults, PowerDiagnostics } from './models/diag';

import type { DeviceConfig } from '../../models/configuration';
import type { DeviceDiagnosticsContext } from '../../models/context';

const DIAGS_INTERVAL = getConfig().app.diagnosticsIntervalMs;

export async function diag() {
  // Will log to console only as using core logger (pino)
  coreLogger.info('diag::diag Performing...');

  const devicesConfig = getConfig().get('devices') as DeviceConfig[];

  await diagForAllDevices(devicesConfig);

  coreLogger.info('diag::diag Done!');

  // Stats are computed once diags are done
  await stats();

  recall(diag, DIAGS_INTERVAL);
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

    const currentDate = new Date();
    deviceDiags.on = currentDate;


    // Ping
    deviceDiags.ping = {
      current: pingResult.current,
      previous: deviceDiags.ping.current,
    };

    // Power state
    deviceDiags.power = computePowerDiags(deviceDiags);
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

function computePowerDiags(diags: DeviceDiagnosticsContext): PowerDiagnostics {
  const { power: powerDiags, ping: { current: { status: currentStatus }}} = diags;

  if (!powerDiags) {
    diags.power = {
      state: PowerStatus.UNAVAILABLE,
    };
  }

  let newPowerState: PowerStatus = PowerStatus.UNAVAILABLE;
  if (currentStatus === FeatureStatus.OK) {
    newPowerState =  PowerStatus.ON;
  }
  if (currentStatus === FeatureStatus.KO) {
    newPowerState = PowerStatus.OFF;
  }

  return {
    ...powerDiags,
    state: newPowerState,
  };
}

