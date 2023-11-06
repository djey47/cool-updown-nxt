import { FeatureDiagnostics, PowerDiagnostics } from '../processors/diag/models/diag';

export interface Context {
  appInfo: AppInfoContext;
  diagnostics: DiagnosticsContext;
  statistics: StatisticsContext;
}

export interface AppInfoContext {
  lastStartOn?: Date;
  initialUptimeSeconds?: number;
}

export interface DiagnosticsContext {
  [deviceId: string]: DeviceDiagnosticsContext;
}

export interface StatisticsContext {
  global: GlobalStatisticsContext;
  perDevice: PerDeviceStatisticsContext;
}

export interface PerDeviceStatisticsContext {
  [deviceId: string]: DeviceStatisticsContext;
}

export interface DeviceDiagnosticsContext {
  on?: Date;
  ping: FeatureDiagnostics;
  power: PowerDiagnostics;
}

export interface DeviceStatisticsContext {
  uptimeSeconds: UptimeStatisticsContext;
}

export interface PersistedContext {
  contents: Context;
  meta: {
    persistedOn: Date;
  };
}

export interface GlobalStatisticsContext {
  appUptimeSeconds?: UptimeStatisticsContext;
}

export interface UptimeStatisticsContext {
  current: number;
  overall: number;
} 
