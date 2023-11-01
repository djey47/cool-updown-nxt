import { FeatureStatus, PowerStatus } from '../../../models/common';

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
  lastStopAttemptOn?: Date;
}
