import type { ScheduleConfig } from '../../../models/configuration';

export interface SchedulesResponse {
  schedules: ScheduleEntries;
}

export type ScheduleEntries = Record<string, ScheduleEntry>;

export interface ScheduleEntry extends ScheduleConfig {
  powerOnExecDates?: PowerExecutionDates;
  powerOffExecDates?: PowerExecutionDates;
}

export interface PowerExecutionDates {
  last?: string;
  next?: string;
}
