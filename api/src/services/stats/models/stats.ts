export interface StatsResponse {
  statistics: {
    app: StatsResponseForApp;
    perDevice: StatsResponseForAllDevices;
  };
}

export interface StatsResponseForApp {
  uptimeSeconds: UptimeInfo;
}

export interface StatsResponseForAllDevices {
  [deviceId: string]: StatsResponseForDevice;
}

export interface StatsResponseForDevice {
  uptimeSeconds: UptimeInfo;
}

export interface UptimeInfo {
  overall: number;
  current: number;
}
