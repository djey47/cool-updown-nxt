import { FeatureStatus, PowerStatus } from '../../../models/common';
import { type FeatureData, LastPowerAttemptReason } from '../../../processors/diag/models/diag';

export interface DiagsResponse {
  diagnostics: DiagsResponseForAllDevices | DiagsResponseForDevice;
}

export interface DiagsResponseForAllDevices {
  [deviceId: string]: DiagsResponseForDevice;
}

export interface DiagsResponseForDevice {
  on?: Date;
  http: DiagsResponseForFeature,
  ping: DiagsResponseForFeature;
  power: PowerDiagsResponse;
  ssh: DiagsResponseForFeature;
}

export interface DiagsResponseForFeature {
  status: FeatureStatus;
  data?: FeatureData;
}

export interface PowerDiagsResponse {
  state: PowerStatus;
  lastStartAttemptOn?: Date;
  lastStopAttemptOn?: Date;
  lastStateChangeReason: LastPowerAttemptReason;
}
