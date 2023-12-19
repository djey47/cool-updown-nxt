import type { ScheduleConfig } from '../../../models/configuration';

export interface SchedulesResponse {
  schedules: ScheduleEntries;
}

export type ScheduleEntries  = Record<string, ScheduleConfig>;
