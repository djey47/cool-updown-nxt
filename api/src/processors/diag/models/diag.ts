import { FeatureStatus, PowerStatus } from '../../../models/common';

export type FeatureData = PingFeatureData | HttpFeatureData | Error;

export interface DiagResults {
  deviceId: string;
  http: FeatureDiagnostics;
  ping: FeatureDiagnostics;
  ssh: FeatureDiagnostics;
}

export interface FeatureDiagnostics {
  data?: FeatureData;
  message?: string;
  status: FeatureStatus;
}

export interface PingFeatureData {
  packetLossRate?: number;
  roundTripTimeMs?: {
    min: number;
    max: number;
    average: number;
    standardDeviation: number;
  };
}

export interface HttpFeatureData {
  statusCode?: number;
  url: string;
}

export interface PowerDiagnostics {
  lastStartAttempt: LastPowerAttemptDiagnostics;
  lastStopAttempt: LastPowerAttemptDiagnostics;
  state: PowerStatus;
}

export interface LastPowerAttemptDiagnostics {
  on?: Date;
  reason: LastPowerAttemptReason;
}

export enum LastPowerAttemptReason {
  /** Neither power on or off has been detected */
  NONE = 'none',
  /** Attempt was made via an API call */
  API = 'api',
  /** Attempt was made via a schedule */
  SCHEDULED = 'scheduled',
  /** Device power state was changed due to an external action (power button, direct WOL...) */
  EXTERNAL = 'external',
}
