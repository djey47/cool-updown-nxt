import { API_STATS_DEVICE } from '../common/api';
import type { DeviceStatistics } from '../model/device';

export async function getStatisticsForDevice(deviceId: string) {
  const response = await fetch(`${API_STATS_DEVICE}${deviceId}`);
  const stats = await response.json();
  return stats.statistics as DeviceStatistics;
}
