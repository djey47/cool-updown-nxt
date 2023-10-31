export interface StatsResults {
  deviceId: string;
  uptimeSeconds: {
    global: number;
    current: number;
  };
}
