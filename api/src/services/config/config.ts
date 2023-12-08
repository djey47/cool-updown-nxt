import { replyWithItemNotFound, replyWithJson } from '../../common/api';
import { getBaseConfig, getDeviceConfig } from '../../common/configuration';

import { ApiItem } from '../../models/api';
import type { FastifyReply } from 'fastify/types/reply';
import type { ConfigResponse } from './models/config';
import type { BaseConfig, DeviceConfig } from '../../models/configuration';

const OBFUSCATED_VALUE = '********';

function obfuscateDeviceConfig(deviceConfig: DeviceConfig): DeviceConfig {
  if (deviceConfig.ssh) {
    return {
      ...deviceConfig,
      ssh: {
        ...deviceConfig.ssh,
        user: OBFUSCATED_VALUE,
        password: deviceConfig.ssh.password !== undefined ? OBFUSCATED_VALUE : undefined ,
      },
    };    
  }
  return {...deviceConfig};
}

function obfuscateBaseConfig(baseConfig: BaseConfig): BaseConfig {
  let baseObfuscatedConfig: BaseConfig = { ...baseConfig };
  if (baseConfig.app.authentication) {
    baseObfuscatedConfig = {
      ...baseConfig,
      app: {
        ...baseConfig.app,
        authentication: {
          ...baseConfig.app.authentication,
          login: OBFUSCATED_VALUE,
          password: OBFUSCATED_VALUE,
        },
      },
    };
  }

  return { 
    ...baseObfuscatedConfig,
    devices: baseConfig.devices
      .map((deviceConfig) => obfuscateDeviceConfig(deviceConfig)),
  };
}

/**
 * Provides global app + all devices configuration 
 */
export function config(reply: FastifyReply) {
  const output: ConfigResponse = {
    configuration: obfuscateBaseConfig(getBaseConfig()),
  };
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
    configuration: obfuscateDeviceConfig(deviceConfig),
  };

  replyWithJson(reply, output);
}
