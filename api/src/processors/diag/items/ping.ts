/* Ping diag item */

import { FeatureStatus } from '../models/diag';

import type{ DeviceConfig } from '../../../models/configuration';
import type { FeatureDiagnostics } from '../models/diag';

/**
 * @returns Promise with all ping diagnostics
 */
export async function pingDiag(deviceId: string, deviceConfig: DeviceConfig): Promise<FeatureDiagnostics> {
  // TODO proper ping implem
  const currentDate = new Date();
  return {
    current: {
      on: currentDate,
      status: FeatureStatus.OK,
    },
  };
}
