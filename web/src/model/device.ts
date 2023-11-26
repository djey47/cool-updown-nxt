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
  };
  http: {
    data?: FeatureData;
    status: FeatureStatus; 
  }
}

export type FeatureStatus = 'ok' | 'ko' | 'n/a'; 

export type FeatureData = HTTPFeatureData;

export interface HTTPFeatureData {
  statusCode: number;
  url: string;
}

export interface DeviceStatistics {
  uptimeSeconds: {
    current: number;
    overall: number;
  };
}
