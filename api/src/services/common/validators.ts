import { FastifyReply } from 'fastify/types/reply';
import { getDeviceConfig } from '../../common/configuration';
import { replyWithItemNotFound } from '../../common/api';
import { ApiItem } from '../../models/api';

/**
 * @returns configuration for provided deviceId if it exists; otherwise if reply is provided, it also instructs Fastify to process a 'not found' response.
 */
export function validateDeviceIdentifier(deviceId: string, reply?: FastifyReply) {
  const deviceConfig = getDeviceConfig(deviceId);
  if (!deviceConfig && !!reply) {
    replyWithItemNotFound(reply, ApiItem.DEVICE_ID, deviceId);
  }
  return deviceConfig;
}
