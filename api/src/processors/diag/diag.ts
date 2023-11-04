import { getConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { coreLogger } from '../../common/logger';
import { recall } from '../../helpers/recaller';
import { FeatureStatus, PowerStatus } from '../../models/common';
import { stats } from '../stats/stats';
import { pingDiag } from './items/ping';
import { DiagResults, LastPowerAttemptDiagnostics, LastPowerAttemptReason, PowerDiagnostics } from './models/diag';

import type { DeviceConfig } from '../../models/configuration';
import type { DeviceDiagnosticsContext } from '../../models/context';
import { differenceInMinutes } from 'date-fns';

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

  // TODO See if still necessary
  if (!powerDiags) {
    diags.power = {
      state: PowerStatus.UNAVAILABLE,
      lastStartAttempt: {
        reason: LastPowerAttemptReason.NONE,
      },
      lastStopAttempt: {
        reason: LastPowerAttemptReason.NONE,
      },
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
    lastStartAttempt: registerAttempt('lastStartAttempt', newPowerState, powerDiags),
    lastStopAttempt: registerAttempt('lastStopAttempt', newPowerState, powerDiags),
    state: newPowerState,
  };
}

function registerAttempt(lastAttemptType: 'lastStartAttempt' | 'lastStopAttempt', newPowerState: PowerStatus, powerDiags: PowerDiagnostics): LastPowerAttemptDiagnostics {
  const { state: lastPowerState} = powerDiags;
  const {on: lastAttemptOn, reason: lastReason } = powerDiags[lastAttemptType];

  const now = new Date();
  const isPowerChangeValid = !lastAttemptOn || differenceInMinutes(lastAttemptOn, now) > 10; // TODO see to tweak this value

  let newReason = lastReason;
  let shouldReasonChange = false;
  if (isPowerChangeValid
      && (
        lastAttemptType === 'lastStartAttempt'
          && newPowerState === PowerStatus.ON
          && lastPowerState === PowerStatus.OFF
        || lastAttemptType === 'lastStopAttempt'
          && newPowerState === PowerStatus.OFF
          && lastPowerState === PowerStatus.ON
      )) {
    newReason = LastPowerAttemptReason.EXTERNAL;
    shouldReasonChange = true;
  }

  // console.log('processors::diag::registerAttempt', { shouldReasonChange, lastAttemptType, isPowerChangeValid, newReason, newPowerState, oldPowerState: lastPowerState });

  const newOn = shouldReasonChange && newReason === LastPowerAttemptReason.EXTERNAL ? now : lastAttemptOn;

  return {
    on: newOn,
    reason: newReason,
  };
}
