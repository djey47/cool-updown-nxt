export interface DeviceInfo {
  network: {
    hostname: string;
  };
  id: string;
}

export interface DeviceDiagnostics {
  ping: {
    status: FeatureStatus;
  };
  power: {
    state: PowerState;
  };
  ssh: {
    status: FeatureStatus;
  };
  http: {
    data?: FeatureData;
    status: FeatureStatus;
  }
}

export const STATUS_UNAVAIL = 'n/a';

export type FeatureStatus = 'ok' | 'ko' | 'n/a';

export type PowerState = 'on' | 'off' | 'n/a';

export type FeatureData = HTTPFeatureData;

export interface HTTPFeatureData {
  statusCode: number;
  url: string;
}

export interface DeviceStatistics {
  uptimeSeconds: DeviceUptimeStatistics;
}

export interface DeviceUptimeStatistics {
  current: number;
  overall: number;
}
