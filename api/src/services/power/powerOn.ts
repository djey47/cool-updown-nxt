import wol from 'wake_on_lan';
import { replyWithInternalError, replyWithJson } from '../../common/api';
import { coreLogger } from '../../common/logger';
import { AppContext } from '../../common/context';
import { ERROR_DEVICE_NOT_FOUND, ERROR_NOOP } from '../common/errors';
import { validateDeviceIdentifier } from '../common/validators';

import type { FastifyBaseLogger } from 'fastify';
import type { FastifyReply } from 'fastify/types/reply';
import type { WakeOptions } from 'wake_on_lan';
import type { DeviceConfig } from '../../models/configuration';
import { PowerStatus } from '../../models/common';
import { LastPowerAttemptReason } from '../../processors/diag/models/diag';

/** 
 * Power->ON service implementation: for a specified device
 */
export async function powerOnForDevice(deviceId: string, reply: FastifyReply) {
  const { log: logger } = reply;

  try {
    await powerOnForDeviceBase(deviceId, logger, LastPowerAttemptReason.API, reply);
    replyWithJson(reply);
  } catch (error) {
    if (error === ERROR_DEVICE_NOT_FOUND) {
      return;
    }

    if (error === ERROR_NOOP) {
      replyWithJson(reply);
    } else {
      // WOL error
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

  try {
    await Promise.all(powerOnPromises);
  } catch (error) {
    coreLogger.error('(powerOnForDevicesScheduled) error when attempting scheduled power ON operation: %s');
  }
}

async function powerOnForDeviceBase(deviceId: string, logger: FastifyBaseLogger, reason: LastPowerAttemptReason, reply?: FastifyReply) {
  const deviceConfig = validateDeviceIdentifier(deviceId, reply);
  if (!deviceConfig) {
    logger.error('(powerOn::powerOnForDeviceBase) Device not found: %s', deviceId);
    throw ERROR_DEVICE_NOT_FOUND;
  }

  // No need to power on device if its power status is ON already
  const deviceDiagContext = AppContext.get().diagnostics[deviceId];
  if (deviceDiagContext?.power.state === PowerStatus.ON) {
    logger.info('(powerOn::powerOnForDeviceBase) NOOP deviceId: %s', deviceId);
    throw ERROR_NOOP;
  }

  // Update context for last start attempt (don't care if it is successful or not)
  deviceDiagContext.power.lastStartAttempt = {
    on: new Date(),
    reason,
  };

  try {
    await awakeDevice(deviceConfig);

    logger.info('(powerOn::powerOnForDeviceBase) OK deviceId: %s', deviceId);
  } catch (wolError) {
    logger.error('(powerOn::powerOnForDeviceBase) KO deviceId: %s - %s', deviceId, wolError);
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
