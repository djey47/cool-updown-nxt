/* Ping diag item */

import { ping } from '../../../helpers/systemGateway';

import type{ DeviceConfig } from '../../../models/configuration';
import type { FeatureDiagnostics } from '../models/diag';

/**
 * @returns Promise with all ping diagnostics
 */
export async function pingDiag(_deviceId: string, deviceConfig: DeviceConfig): Promise<FeatureDiagnostics> {
  const result = await ping(deviceConfig.network.hostname);

  return {
    status: result.status,
    message: result.errorOutput,
  };
}
