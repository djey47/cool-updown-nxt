import { replyWithItemNotFound, replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';

import type { FastifyReply } from 'fastify';
import type { DiagsResponse, DiagsResponseForAllDevices, DiagsResponseForDevice, DiagsResponseForFeature, PowerDiagsResponse as DiagsResponseForPower } from './models/diags';
import type { DeviceDiagnosticsContext, DiagnosticsContext } from '../../models/context';
import type { FeatureDiagnostics, PowerDiagnostics } from '../../processors/diag/models/diag';
import { ApiItem } from '../../models/api';

/** 
 * Diagnostics service implementation: for all configured devices
 */
export async function diags(reply: FastifyReply) {
  const appContext = AppContext.get();
  const { diagnostics } = appContext;

  const output: DiagsResponse = {
    diagnostics: diagsContextAllDevicesToResponse(diagnostics),
  };

  replyWithJson(reply, output);
}

/** 
 * Diagnostics service implementation: for a specified device
 */
export async function diagsForDevice(deviceId: string, reply: FastifyReply) {
  const appContext = AppContext.get();
  const { diagnostics } = appContext;

  const deviceDiags = diagnostics[deviceId];
  if (!deviceDiags) {
    replyWithItemNotFound(reply, ApiItem.DEVICE_ID, deviceId);
    return;
  }

  const output: DiagsResponse = {
    diagnostics: diagsContextForDeviceToResponse(deviceDiags),
  }
  
  replyWithJson(reply, output);
}

function diagsContextAllDevicesToResponse(diagsContext: DiagnosticsContext): DiagsResponseForAllDevices {
  return Object.entries(diagsContext)
    .sort(([deviceId1], [deviceId2]) => deviceId1.localeCompare(deviceId2))
    .reduce((acc: DiagsResponseForAllDevices, [ deviceId, deviceDiags]) => {
      acc[deviceId] = diagsContextForDeviceToResponse(deviceDiags);
      return acc;
    }, {});
}

function diagsContextForDeviceToResponse(deviceDiags: DeviceDiagnosticsContext): DiagsResponseForDevice {
  const { on, ping, power, ssh, http } = deviceDiags;
  return {
    on,
    http: diagsFeatureToResponse(http),
    ping: diagsFeatureToResponse(ping),
    power: diagsPowerToResponse(power),
    ssh: diagsFeatureToResponse(ssh),
  };
}

function diagsFeatureToResponse(featureDiags: FeatureDiagnostics): DiagsResponseForFeature {
  const { status, data } = featureDiags;
  return {
    data,
    status,
  };
}

function diagsPowerToResponse(powerDiagnostics: PowerDiagnostics): DiagsResponseForPower {
  const { lastStartAttempt, lastStopAttempt } = powerDiagnostics; 
  return {
    lastStartAttemptOn: lastStartAttempt?.on,
    lastStartAttemptReason: lastStartAttempt?.reason,
    lastStopAttemptOn: lastStopAttempt?.on,
    lastStopAttemptReason: lastStopAttempt?.reason,
    state: powerDiagnostics.state,
  };
}

