import { replyWithInternalError, replyWithItemNotFound, replyWithJson } from '../../common/api';
import { getDeviceConfig } from '../../common/configuration';
import { AppContext } from '../../common/context';
import { SSH_DEFAULT_OFF_COMMAND, sshExec } from '../../helpers/ssh';

import type { FastifyReply } from 'fastify/types/reply';
import type{ DeviceConfig } from '../../models/configuration';
import { ApiItem } from '../../models/api';
import { PowerStatus } from '../../models/common';
import { LastPowerAttemptReason } from '../../processors/diag/models/diag';

/** 
 * Power->OFF service implementation: for a specified device
 */
export async function powerOffForDevice(deviceId: string, reply: FastifyReply) {
  const { log: logger } = reply;

  const deviceConfig = getDeviceConfig(deviceId);
  if (!deviceConfig) {
    replyWithItemNotFound(reply, ApiItem.DEVICE_ID, deviceId);
    return;
  }

  // No need to power off device if its power status is OFF already
  // Don't attempt to power off if ssh configuration is missing
  const deviceDiagContext = AppContext.get().diagnostics[deviceId];
  if (deviceDiagContext?.power.state === PowerStatus.OFF || !deviceConfig.ssh) {
    logger.info(`(powerOff::powerOffForDevice) NOOP serverId:${deviceId}`);
    replyWithJson(reply);
    return;
  }

  // Update context for last stop attempt (don't care if it is successful or not)
  deviceDiagContext.power.lastStopAttempt = {
    on: new Date(),
    reason: LastPowerAttemptReason.API,
  };

  try {
    const { stdout, stderr } = await shutdownDevice(deviceConfig);

    logger.info(`(powerOff::powerOffForDevice) OK serverId:${deviceId}`);
    
    console.log('powerOff::powerOffForDevice', { stdout, stderr });

    replyWithJson(reply);
  } catch (sshError) {
    logger.error(`(powerOff::powerOffForDevice) KO serverId:${deviceId}-${sshError}`);

    replyWithInternalError(reply, `Unable to perform shutdown via SSH: ${sshError}`);
  }
}

async function shutdownDevice(deviceConfig: DeviceConfig) {
  const { ssh: sshConfiguration } = deviceConfig;

  // console.log('powerOff::shutdownDevice', { sshConfiguration, sshClientConfig });

  const { stdout, stderr, code } = await sshExec(sshConfiguration?.offCommand || SSH_DEFAULT_OFF_COMMAND, deviceConfig)

  if (code !== 0) throw stderr;

  return {
    stdout,
    stderr,
  };
}
