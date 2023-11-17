import { API_POWER_OFF_DEVICE, API_POWER_ON_DEVICE } from '../common/api';

export async function postPowerOnForDevice(deviceId: string) {
  await fetch(`${API_POWER_ON_DEVICE}${deviceId}`, { method: 'POST'});
}

export async function postPowerOffForDevice(deviceId: string) {
  await fetch(`${API_POWER_OFF_DEVICE}${deviceId}`, { method: 'POST'});
}
