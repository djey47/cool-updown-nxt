export interface DeviceInfo {
  network: {
    hostname: string;
  };
  id: string;
}

export interface DeviceDiagnostics {
  ping: {
    status: 'ok' | 'ko' | 'n/a';
  };
  power: {
    state: 'on' | 'off' | 'n/a';
  };
}
