/**
 * SSH support functions
 */

import { readPrivateKey } from './auth';

import type { Config } from 'node-ssh';
import type { DeviceConfig } from '../models/configuration';

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
