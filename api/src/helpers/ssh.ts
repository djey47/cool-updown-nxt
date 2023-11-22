/**
 * SSH support functions
 */

import { readPrivateKey } from './auth';
import { NodeSSH, type Config, type SSHExecCommandOptions } from 'node-ssh';

import type { DeviceConfig } from '../models/configuration';

export interface ExecOptions {
  /** Should exit command to be invoked automatically after requested command */
  exitOnFinished?: boolean;
  /** If a password should be provided via stdin (e.g sudo ... commands) */
  password?: string;
}

/* 
 * Background process (-b), read password from stdin (-S), shutdown server in one minute
 */
export const SSH_DEFAULT_OFF_COMMAND = 'sudo -bS shutdown -h 1';

const sshClient = new NodeSSH();

/**
 * @returns Result of specified command execution via SSH
 */
export async function sshExec(command: string, deviceConfig: DeviceConfig, execOptions?: ExecOptions) {
  const sshClientConfig = await getSSHParameters(deviceConfig);

  console.log('ssh::sshExec', { sshClientConfig });

  await sshClient.connect(sshClientConfig);

  const commandOptions: SSHExecCommandOptions = {};
  const password = execOptions?.password;
  if (password !== undefined) {
    commandOptions.stdin = `${password}\n`; 
  }

  const commandResult = await sshClient.execCommand(command, commandOptions);

  if (execOptions?.exitOnFinished) {
    await(sshClient.execCommand('exit'));
  }

  sshClient.dispose();

  return commandResult;
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
