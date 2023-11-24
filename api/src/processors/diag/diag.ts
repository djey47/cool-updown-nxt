import { getConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';
import { statsProcessor } from '../stats/stats';
import { pingDiag } from './items/ping';
import { sshDiag } from './items/ssh';
import { powerDiag } from './items/power';
import { httpDiag } from './items/http';

import type { DiagResults, FeatureDiagnostics } from './models/diag';
import type { DeviceConfig } from '../../models/configuration';
import { FeatureStatus } from '../../models/common';

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
    const { deviceId, http: httpResult, ping: pingResult, ssh: sshResult } = result;
    const deviceDiags = appContext.diagnostics[deviceId] || { ping: {} };
    appContext.diagnostics[deviceId] = deviceDiags;

    // Previous diagnostics
    deviceDiags.previous = {
      on: deviceDiags.on,
      http: { ...deviceDiags.http },
      ping: { ...deviceDiags.ping },
      power: { ...deviceDiags.power },
      ssh: { ...deviceDiags.ssh },
    };

    // Current diagnostics
    const currentDate = new Date();
    deviceDiags.on = currentDate;

    // Ping
    deviceDiags.ping = pingResult;

    // SSH
    deviceDiags.ssh = sshResult;

    // HTTP
    deviceDiags.http = httpResult;

    // Power state
    deviceDiags.power = powerDiag(deviceDiags);
  });
}

async function diagByDevice(deviceId: string, deviceConfig: DeviceConfig): Promise<DiagResults> {
  const pingResults = await pingDiag(deviceId, deviceConfig);

  let sshResults: FeatureDiagnostics;
  // If ping fails, SSH connectivity cannot be tested
  if (pingResults.status === FeatureStatus.KO) {
    sshResults = {
      status: FeatureStatus.UNAVAILABLE,
      message: `Device with id=${deviceId} has failed ping test thus SSH connectivity cannot be tested.`,
    }
  } else {
    sshResults = await sshDiag(deviceId, deviceConfig);
  }

  let httpResults: FeatureDiagnostics;
  // If ping fails, HTTP cannot be tested
  if (pingResults.status === FeatureStatus.KO) {
    httpResults = {
      status: FeatureStatus.UNAVAILABLE,
      message: `Device with id=${deviceId} has failed ping test thus HTTP cannot be tested.`,
    }
  } else {
    httpResults = await httpDiag(deviceId, deviceConfig);
  }
  
  return {
    deviceId,
    http: httpResults,
    ping: pingResults,
    ssh: sshResults,
  };
}
