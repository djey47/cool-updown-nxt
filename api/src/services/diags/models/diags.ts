import { FeatureStatus, PowerStatus } from '../../../models/common';
import { LastPowerAttemptReason } from '../../../processors/diag/models/diag';

export interface DiagsResponse {
  diagnostics: DiagsResponseForAllDevices | DiagsResponseForDevice;
}

export interface DiagsResponseForAllDevices {
  [deviceId: string]: DiagsResponseForDevice;
}

export interface DiagsResponseForDevice {
  on?: Date;
  ping: DiagsResponseForFeature;
  power: PowerDiagsResponse;
}

export interface DiagsResponseForFeature {
  on?: Date;
  status: FeatureStatus;
}

export interface PowerDiagsResponse {
  state: PowerStatus;
  lastStartAttemptOn?: Date;
  lastStartAttemptReason: LastPowerAttemptReason;
  lastStopAttemptOn?: Date;
  lastStopAttemptReason: LastPowerAttemptReason;
}
