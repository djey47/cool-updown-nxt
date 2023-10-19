import type { IConfig } from 'config';

export type Config = BaseConfig & IConfig;

export interface BaseConfig {
  app: AppConfig;
}

interface AppConfig {
  host: string;
  port: number;
  diagnosticsIntervalMs: number;
}
