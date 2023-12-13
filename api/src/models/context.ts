import { FeatureDiagnostics, PowerDiagnostics } from '../processors/diag/models/diag';
import { ScheduleConfig } from './configuration';

export interface Context {
  appInfo: AppInfoContext;
  diagnostics: DiagnosticsContext;
  statistics: StatisticsContext;
  schedules: ScheduleContext[];
}

export interface AppInfoContext {
  lastStartOn?: Date;
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
  http: FeatureDiagnostics,
  ping: FeatureDiagnostics;
  power: PowerDiagnostics;
  previous?: DeviceDiagnosticsContext;
  ssh: FeatureDiagnostics;
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

export interface ScheduleContext extends ScheduleConfig {
  id: string;
}
