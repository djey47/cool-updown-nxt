import { NodeSSH, type SSHExecCommandOptions } from 'node-ssh';
import { SSH_DIAG_DEFAULT_COMMAND, getSSHParameters } from '../../../helpers/ssh';
import type { DeviceConfig } from '../../../models/configuration';
import { FeatureDiagnostics } from '../models/diag';
import { FeatureStatus } from '../../../models/common';

// FIXME extract node SSH instance to helper
const ssh = new NodeSSH();

export async function sshDiag(deviceId: string, deviceConfig: DeviceConfig): Promise<FeatureDiagnostics> {
  const { ssh: sshConfiguration } = deviceConfig;
  if (!sshConfiguration) {
    return {
      status: FeatureStatus.UNAVAILABLE,
      message: `Device with id=${deviceId} has no configured SSH capability.`
    };
  }

  const sshClientConfig = await getSSHParameters(deviceConfig);

  console.log('ssh::ssshDiag', { deviceId, sshConfiguration, sshClientConfig });

  try {
    await ssh.connect(sshClientConfig);

    const commandOptions: SSHExecCommandOptions = {};

    const command = SSH_DIAG_DEFAULT_COMMAND;
    await ssh.execCommand(command, commandOptions);

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