import { FeatureStatus, PowerStatus } from '../../../models/common';

export interface DiagResults {
  deviceId: string;
  ping: FeatureDiagnostics;
}

export interface FeatureDiagnostics {
  current: FeatureDiagnosticsResults;
  previous?: FeatureDiagnosticsResults;
}

export interface PowerDiagnostics {
  lastStartAttemptOn?: Date;
  lastStopAttemptOn?: Date;
  state: PowerStatus;
}

export interface FeatureDiagnosticsResults {
  message?: string;
  on: Date;
  status: FeatureStatus;
}
