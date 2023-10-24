export interface DiagResults {
  deviceId: string;
  ping: FeatureDiagnostics;
}

export interface FeatureDiagnostics {
  current: FeatureDiagnosticsResults,
  previous?: FeatureDiagnosticsResults,
}

export interface FeatureDiagnosticsResults {
  message?: string;
  on: Date;
  status: FeatureStatus;
}

export enum FeatureStatus {
  OK = 'ok',
  KO = 'ko',
  UNAVAILABLE = 'n/a',
}
