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
    state: 'on' | 'off' | 'n/a';
  };
  ssh: {
    status: FeatureStatus; 
  }
}

export type FeatureStatus = 'ok' | 'ko' | 'n/a'; 

export interface DeviceStatistics {
  uptimeSeconds: {
    current: number;
    overall: number;
  };
}
