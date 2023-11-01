/**
 * Normalized access to application configuration
 */

import config from 'config';

import type { BaseConfig, Config } from '../models/configuration';

/**
 * @returns configuration with convenient node-config wrapper
 */
export function getConfig() {
  return config as Config;
}

/**
 * @returns configuration data only (does not wrap with node-config)
 */
export function getBaseConfig() {
  const { get: _get, has: _has, util: _util, ...baseConfig } = getConfig();
  return baseConfig as BaseConfig;
}

/**
 * @returns configuration for a specified device, or undefined if it is not found
 */
export function getDeviceConfig(deviceId: string) {
  // TODO device identifier is rank for now
  return getConfig().devices.find((_dc, index) => String(index) === deviceId);
}
