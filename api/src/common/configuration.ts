import config from 'config';

import type { BaseConfig, Config } from '../models/configuration';

export function getConfig() {
  return config as Config;
}

export function getBaseConfig() {
  const { get: _get, has: _has, util: _util, ...baseConfig } = getConfig();
  return baseConfig as BaseConfig;
}
