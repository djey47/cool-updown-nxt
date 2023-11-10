import type { BaseConfig, DeviceConfig } from '../../../models/configuration';

export interface ConfigResponse {
  configuration: BaseConfig | DeviceConfig;
}
