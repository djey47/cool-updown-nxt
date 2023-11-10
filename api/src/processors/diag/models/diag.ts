import { FeatureStatus, PowerStatus } from '../../../models/common';

export interface DiagResults {
  deviceId: string;
  ping: FeatureDiagnostics;
}

export interface FeatureDiagnostics {
  message?: string;
  on?: Date;
  status: FeatureStatus;
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
