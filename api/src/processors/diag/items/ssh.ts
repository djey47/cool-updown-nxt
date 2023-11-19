import { SSH_DIAG_DEFAULT_COMMAND, sshExec } from '../../../helpers/ssh';

import type { DeviceConfig } from '../../../models/configuration';
import type { FeatureDiagnostics } from '../models/diag';
import { FeatureStatus } from '../../../models/common';

/**
 * @returns results of SSH connectivity diagnostics as Promise
 */
export async function sshDiag(deviceId: string, deviceConfig: DeviceConfig): Promise<FeatureDiagnostics> {
  const { ssh: sshConfiguration } = deviceConfig;
  if (!sshConfiguration) {
    return {
      status: FeatureStatus.UNAVAILABLE,
      message: `Device with id=${deviceId} has no configured SSH capability.`
    };
  }

  console.log('ssh::sshDiag', { deviceId, sshConfiguration });

  try {
    await sshExec(SSH_DIAG_DEFAULT_COMMAND, deviceConfig);
    return {
      status: FeatureStatus.OK,
    };
  } catch (error) {
    const sshError = error as Error;
    return {
      data: sshError,
      status: FeatureStatus.KO,
      message: sshError.message,
    }
  }
}