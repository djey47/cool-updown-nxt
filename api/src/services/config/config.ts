import { replyWithItemNotFound, replyWithJson } from '../../common/api';
import { getBaseConfig, getDeviceConfig } from '../../common/configuration';

import type { FastifyReply } from 'fastify/types/reply';
import { ConfigResponse } from './models/config';
import { ApiItem } from '../../models/api';

/**
 * Provides global app + all devices configuration 
 */
export function config(reply: FastifyReply) {
  const output: ConfigResponse = {
    configuration: getBaseConfig(),
  };
  // TODO obfuscate sensitive parameters
  replyWithJson(reply, output);
}

/**
 * Provides configuration for device having provided deviceId
 */
export function configForDevice(deviceId: string, reply: FastifyReply) {
  const deviceConfig = getDeviceConfig(deviceId);

  if (!deviceConfig) {
    replyWithItemNotFound(reply, ApiItem.DEVICE_ID, deviceId);
    return;
  }

  const output: ConfigResponse = {
    configuration: deviceConfig,
  };

  // TODO obfuscate sensitive parameters
  replyWithJson(reply, output);
}
