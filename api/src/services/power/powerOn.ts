import wol from 'wake_on_lan';
import { getDeviceConfig } from '../../common/configuration';
import { replyWithInternalError, replyWithItemNotFound, replyWithJson } from '../../common/api';
import { coreLogger } from '../../common/logger';
import { AppContext } from '../../common/context';

import type { FastifyBaseLogger } from 'fastify';
import type { FastifyReply } from 'fastify/types/reply';
import type { WakeOptions } from 'wake_on_lan';
import type { DeviceConfig } from '../../models/configuration';
import { ApiItem } from '../../models/api';
import { PowerStatus } from '../../models/common';
import { LastPowerAttemptReason } from '../../processors/diag/models/diag';

const ERROR_DEVICE_NOT_FOUND = 'DNF';
const ERROR_NOOP = 'NOOP';

/** 
 * Power->ON service implementation: for a specified device
 */
export async function powerOnForDevice(deviceId: string, reply: FastifyReply) {
  const { log: logger } = reply;

  try {
    await powerOnForDeviceBase(deviceId, logger, LastPowerAttemptReason.API);
    replyWithJson(reply);
  } catch (error) {
    if (error === ERROR_DEVICE_NOT_FOUND) {
      replyWithItemNotFound(reply, ApiItem.DEVICE_ID, deviceId);
    } else if (error === ERROR_NOOP) {
      replyWithJson(reply);
    } else {
      // WOL ERROR
      replyWithInternalError(reply, `Unable to perform wake on LAN: ${error}`);
    }
    return;
  }
}

/** 
 * Power->ON service implementation: for a list of specified devices
 * And scheduled mode (no reply)
 */
export async function powerOnForDevicesScheduled(deviceIds: string[]) {
  const powerOnPromises = deviceIds.map((deviceId) => powerOnForDeviceBase(deviceId, coreLogger, LastPowerAttemptReason.SCHEDULED));
  await Promise.all(powerOnPromises);
}

async function powerOnForDeviceBase(deviceId: string, logger: FastifyBaseLogger, reason: LastPowerAttemptReason) {
  const deviceConfig = getDeviceConfig(deviceId);
  if (!deviceConfig) {
    throw ERROR_DEVICE_NOT_FOUND;
  }

  // No need to power on device if its power status is ON already
  const deviceDiagContext = AppContext.get().diagnostics[deviceId];
  if (deviceDiagContext?.power.state === PowerStatus.ON) {
    logger.info(`(powerOn::powerOnForDeviceBase) NOOP serverId:${deviceId}`);
    throw ERROR_NOOP;
  }

  // Update context for last start attempt (don't care if it is successful or not)
  deviceDiagContext.power.lastStartAttempt = {
    on: new Date(),
    reason,
  };

  try {
    await awakeDevice(deviceConfig);

    logger.info(`(powerOn::powerOnForDeviceBase) OK serverId:${deviceId}`);
  } catch (wolError) {
    logger.error(`(powerOn::powerOnForDeviceBase) KO serverId:${deviceId}-${wolError}`);
    throw wolError;
  }
}

async function awakeDevice(deviceConfig: DeviceConfig) {
  const { network: { macAddress, broadcastIpAddress } } = deviceConfig;
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
