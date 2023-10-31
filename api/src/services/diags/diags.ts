import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';

import type { FastifyReply } from 'fastify';
import type { DiagsResponse, DiagsResponseForAllDevices, DiagsResponseForDevice, DiagsResponseForFeature, PowerDiagsResponse as DiagsResponseForPower } from './models/diags';
import type { DiagnosticsContext } from '../../models/context';
import type { FeatureDiagnostics, PowerDiagnostics } from '../../processors/diag/models/diag';

/** 
 * Diagnostics service implementation
 */
export async function diags(reply: FastifyReply) {
  const appContext = AppContext.get();

  const { diagnostics } = appContext;

  const output: DiagsResponse = {
    diagnostics: diagsContextToResponse(diagnostics),
  };

  replyWithJson(reply, output);
}

function diagsContextToResponse(diagsContext: DiagnosticsContext): DiagsResponseForAllDevices {
  return Object.entries(diagsContext)
    .sort(([deviceId1], [deviceId2]) => deviceId1.localeCompare(deviceId2))
    .reduce((acc: DiagsResponseForAllDevices, [ deviceId, deviceDiags]) => {
      const { on, ping, power } = deviceDiags;
      const resultEntry: DiagsResponseForDevice = {
        on,
        ping: diagsFeatureToResponse(ping),
        power: diagsPowerToResponse(power),
      };
      acc[deviceId] = resultEntry;
      return acc;
    }, {});
}

function diagsFeatureToResponse(featureDiags: FeatureDiagnostics): DiagsResponseForFeature {
  const { current: { on, status} } = featureDiags;
  return {
    on, 
    status,
  };
}

function diagsPowerToResponse(powerDiagnostics: PowerDiagnostics): DiagsResponseForPower {
  return {
    lastStartAttemptOn: powerDiagnostics.lastStartAttemptOn,
    lastStopAttemptOn: powerDiagnostics.lastStopAttemptOn,
    state: powerDiagnostics.state,
  };
}

