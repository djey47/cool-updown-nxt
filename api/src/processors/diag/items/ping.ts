/* Ping diag item */

import { ping } from '../../../helpers/systemGateway';

import type{ DeviceConfig } from '../../../models/configuration';
import type { FeatureDiagnosticsResults } from '../models/diag';

/**
 * @returns Promise with all ping diagnostics
 */
export async function pingDiag(_deviceId: string, deviceConfig: DeviceConfig): Promise<FeatureDiagnosticsResults> {
  const result = await ping(deviceConfig.network.hostname);

  const currentDate = new Date();
  return {
    on: currentDate,
    status: result.status,
    message: result.errorOutput,
  };
}
