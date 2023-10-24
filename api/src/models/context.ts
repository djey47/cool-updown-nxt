import { FeatureDiagnostics } from '../processors/diag/models/diag';

export interface Context {
 diagnostics: DiagnosticsContext;
}

export interface DiagnosticsContext {
  [deviceId: string]: DeviceDiagnosticsContext;    
}

export interface DeviceDiagnosticsContext {
  on: Date;
  ping: FeatureDiagnostics;
}
