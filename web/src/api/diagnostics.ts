import { API_DIAGS_DEVICE } from '../common/api';
import { DeviceDiagnostics } from '../model/device';

export async function getDiagnosticsForDevice(deviceId: string) {
  const response = await fetch(`${API_DIAGS_DEVICE}${deviceId}`);
  const diags = await response.json();
  return diags.diagnostics as DeviceDiagnostics;
}
