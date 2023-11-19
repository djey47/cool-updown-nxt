/**
 * SSH support functions
 */

import { readPrivateKey } from './auth';

import { NodeSSH, type Config, type SSHExecCommandOptions } from 'node-ssh';
import type { DeviceConfig } from '../models/configuration';

/*
 * Directly exits
 */ 
export const SSH_DIAG_DEFAULT_COMMAND = "exit";

/* 
 * Background process (-b), read password from stdin (-S), shutdown server in one minute
 */
export const SSH_DEFAULT_OFF_COMMAND = 'sudo -bS shutdown -h 1;exit';

const sshClient = new NodeSSH();

/**
 * @returns Result of specified command execution via SSH
 */
export async function sshExec(command: string, deviceConfig: DeviceConfig, withPassword = false) {
  const { ssh: sshConfiguration } = deviceConfig;
  const sshClientConfig = await getSSHParameters(deviceConfig);

  console.log('ssh::sshExec', { sshConfiguration, sshClientConfig });

  await sshClient.connect(sshClientConfig);

  const commandOptions: SSHExecCommandOptions = {};
  const password = sshConfiguration?.password;
  if (withPassword && password !== undefined) {
    commandOptions.stdin = `${password}\n`; 
  }

  return await sshClient.execCommand(command, commandOptions);
}

async function getSSHParameters(deviceConfiguration: DeviceConfig): Promise<Config> {
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
