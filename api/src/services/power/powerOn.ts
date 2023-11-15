import wol from 'wake_on_lan';
import { getDeviceConfig } from '../../common/configuration';
import { replyWithInternalError, replyWithItemNotFound, replyWithJson } from '../../common/api';
import { ApiItem } from '../../models/api';
import { AppContext } from '../../common/context';
import { PowerStatus } from '../../models/common';

import type { FastifyReply } from 'fastify/types/reply';
import type { WakeOptions } from 'wake_on_lan';
import type { DeviceConfig } from '../../models/configuration';
import { LastPowerAttemptReason } from '../../processors/diag/models/diag';

/** 
 * Power->ON service implementation: for a specified device
 */
export async function powerOnForDevice(deviceId: string, reply: FastifyReply) {
  const { log: logger } = reply;

  const deviceConfig = getDeviceConfig(deviceId);
  if (!deviceConfig) {
    replyWithItemNotFound(reply, ApiItem.DEVICE_ID, deviceId);
    return;
  }

  // No need to power on device if its power status is ON already
  const deviceDiagContext = AppContext.get().diagnostics[deviceId];
  if (deviceDiagContext?.power.state === PowerStatus.ON) {
    logger.info(`(powerOn::powerOnForDevice) NOOP serverId:${deviceId}`);
    replyWithJson(reply);
    return;
  }

  // Update context for last start attempt (don't care if it is successful or not)
  deviceDiagContext.power.lastStartAttempt = {
    on: new Date(),
    reason: LastPowerAttemptReason.API,
  };

  try {
    await awakeDevice(deviceConfig);

    logger.info(`(powerOn::powerOnForDevice) OK serverId:${deviceId}`);

    replyWithJson(reply);
  } catch (wolError) {
    logger.error(`(powerOn::powerOnForDevice) KO serverId:${deviceId}-${wolError}`);

    replyWithInternalError(reply, `Unable to perform wake on LAN: ${wolError}`);
  }
}

async function awakeDevice(deviceConfig: DeviceConfig) {
  const { network: { macAddress, broadcastIpAddress }} = deviceConfig;
  const options: WakeOptions = {
    address: broadcastIpAddress,
  };
  return new Promise<void>((resolve, reject) => {
    wol.wake(macAddress, options, (error: Error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });  
  });
}
