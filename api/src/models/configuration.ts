import type { IConfig } from 'config';

export type Config = BaseConfig & IConfig;

export interface BaseConfig {
  app: AppConfig;
  devices: DeviceConfig[];
}

export interface AppConfig {
  authentication?: AuthConfig;
  host: string;
  port: number;
  diagnosticsIntervalMs: number;
}

export interface AuthConfig {
  enabled: boolean;
  login: string;
  password: string;    
}

export interface DeviceConfig {
  network: DeviceNetworkConfig;
  http?: DeviceHTTPConfig;
  ssh?: DeviceSSHConfig;
}

interface DeviceNetworkConfig {
  broadcastIpAddress: string;
  hostname: string;
  macAddress: string;
}

export interface DeviceSSHConfig {
  keyPath: string;
  offCommand?: string;
  password?: string;
  port?: number;
  user: string;
}

export interface DeviceHTTPConfig {
  url: string;
}
