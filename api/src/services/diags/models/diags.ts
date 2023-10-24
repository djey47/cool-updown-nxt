import { FeatureStatus } from '../../../models/common';

export interface DiagsResponse {
  diagnostics: DiagsResponseForAllDevices;
}

export interface DiagsResponseForAllDevices {
  [deviceId: string]: DiagsResponseForDevice;
}

export interface DiagsResponseForDevice {
  on: Date;
  ping: DiagsResponseForFeature;
}

export interface DiagsResponseForFeature {
  on: Date;
  status: FeatureStatus;
}
