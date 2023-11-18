/**
 * SSH support functions
 */

import { readPrivateKey } from './auth';

import type { Config } from 'node-ssh';
import type { DeviceConfig } from '../models/configuration';

export const SSH_DIAG_DEFAULT_COMMAND = "exit";

// FIXME move SSH_OFF_DEFAULT_COMMAND here

/**
 * @returns the proper SSH connection parameters from provider device config
 */
export async function getSSHParameters(deviceConfiguration: DeviceConfig): Promise<Config> {
  const { ssh: sshConf, network: netConf} = deviceConfiguration;
  const privateKeyPath = sshConf?.keyPath;
  const privateKey = await readPrivateKey(privateKeyPath);

  return {
    host: netConf?.hostname,
    port: sshConf?.port,
    username: sshConf?.user,
    privateKey,
  };
}
