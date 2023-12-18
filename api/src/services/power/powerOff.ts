import { replyWithInternalError, replyWithItemNotFound, replyWithJson } from '../../common/api';
import { getDeviceConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { ExecOptions, SSH_DEFAULT_OFF_COMMAND, sshExec } from '../../helpers/ssh';
import { ERROR_DEVICE_NOT_FOUND, ERROR_NOOP } from '../common/errors';
import { coreLogger } from '../../common/logger';

import type { FastifyReply } from 'fastify/types/reply';
import type { FastifyBaseLogger } from 'fastify/types/logger';
import type { DeviceConfig } from '../../models/configuration';
import { ApiItem } from '../../models/api';
import { PowerStatus } from '../../models/common';
import { LastPowerAttemptReason } from '../../processors/diag/models/diag';

/** 
 * Power->OFF service implementation: for a specified device
 */
export async function powerOffForDevice(deviceId: string, reply: FastifyReply) {
  const { log: logger } = reply;

  try {
    await powerOffForDeviceBase(deviceId, logger, LastPowerAttemptReason.API);
    replyWithJson(reply);
  } catch (error) {
    if (error === ERROR_DEVICE_NOT_FOUND) {
      replyWithItemNotFound(reply, ApiItem.DEVICE_ID, deviceId);
    } else if (error === ERROR_NOOP) {
      replyWithJson(reply);
    } else {
      // SSH error
      replyWithInternalError(reply, `Unable to perform shutdown via SSH: ${error}`);
    }
    return;
  }
}

/** 
 * Power->OFF service implementation: for a list of specified devices
 * And scheduled mode (no reply)
 */
export async function powerOffForDevicesScheduled(deviceIds: string[]) {
  const powerOffPromises = deviceIds.map((deviceId) => powerOffForDeviceBase(deviceId, coreLogger, LastPowerAttemptReason.SCHEDULED));
  try {
    await Promise.all(powerOffPromises);
  } catch (error) {
    coreLogger.error('(powerOffForDevicesScheduled) error when attempting scheduled power OFF operation');
  }
}

async function powerOffForDeviceBase(deviceId: string, logger: FastifyBaseLogger, reason: LastPowerAttemptReason) {
  const deviceConfig = getDeviceConfig(deviceId);
  if (!deviceConfig) {
    throw ERROR_DEVICE_NOT_FOUND;
  }

  // No need to power off device if its power status is OFF already
  // Don't attempt to power off if ssh configuration is missing
  const deviceDiagContext = AppContext.get().diagnostics[deviceId];
  if (deviceDiagContext?.power.state === PowerStatus.OFF || !deviceConfig.ssh) {
    logger.info(`(powerOff::powerOffForDeviceBase) NOOP serverId:${deviceId}`);
    throw ERROR_NOOP;
  }

  // Update context for last stop attempt (don't care if it is successful or not)
  deviceDiagContext.power.lastStopAttempt = {
    on: new Date(),
    reason,
  };

  try {
    const { stdout, stderr } = await shutdownDevice(deviceConfig);

    logger.info(`(powerOff::powerOffForDeviceBase) OK serverId:${deviceId}`);
    
    logger.debug('(powerOff::powerOffForDeviceBase)', { stdout, stderr });
  } catch (sshError) {
    logger.error(`(powerOff::powerOffForDeviceBase) KO serverId:${deviceId}-${sshError}`);

    throw sshError;
  }    
}

async function shutdownDevice(deviceConfig: DeviceConfig) {
  const { ssh: sshConfiguration } = deviceConfig;

  // console.log('powerOff::shutdownDevice', { sshConfiguration, sshClientConfig });

  const execOpts: ExecOptions = {
    password: sshConfiguration?.password,
    exitOnFinished: true,
  };
  const { stdout, stderr, code } = await sshExec(sshConfiguration?.offCommand || SSH_DEFAULT_OFF_COMMAND, deviceConfig, execOpts);
  
  // console.log('powerOff::shutdownDevice', { stdout, stderr, code });
  
  if (code !== 0) throw stderr;

  return {
    stdout,
    stderr,
  };
}
