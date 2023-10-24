import type { IConfig } from 'config';

export type Config = BaseConfig & IConfig;

export interface BaseConfig {
  app: AppConfig;
  devices: DeviceConfig[];
}

export interface AppConfig {
  host: string;
  port: number;
  diagnosticsIntervalMs: number;
}

export interface DeviceConfig {
  network: DeviceNetworkConfig;
}

interface DeviceNetworkConfig {
  hostname: string;  
}
