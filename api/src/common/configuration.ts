import config from 'config';

import type { BaseConfig, Config } from '../models/configuration';

export function getConfig() {
  return config as Config;
}

export function getBaseConfig() {
  const { get, has, util, ...baseConfig } = getConfig();
  return baseConfig as BaseConfig;
}
