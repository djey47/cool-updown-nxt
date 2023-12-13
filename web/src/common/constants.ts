import type { PowerState, PowerStateChangeReason } from '../model/device';

export const POWER_STATE_LABELS: Record<PowerState, string> = {
  'n/a': 'unavailable',
  on: 'ON',
  off: 'OFF',
};

export const POWER_STATE_CHANGE_REASON_LABELS: Record<PowerStateChangeReason, string> = {
  'none': 'none',
  api: 'cud-nxt API call',
  scheduled: 'cud-nxt scheduled operation',
  external: 'external cause (power switch, power loss...)',
};
