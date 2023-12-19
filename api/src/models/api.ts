import type { HomeResponse } from '../services/home/models/home';
import type { LogsResponse } from '../services/logs/models/logs';
import type { ConfigResponse } from '../services/config/models/config';
import type { DiagsResponse } from '../services/diags/models/diags';
import type { StatsResponse } from '../services/stats/models/stats';
import type { FastifyRequest } from 'fastify';
import { SchedulesResponse } from '../services/schedules/models/schedules';

export type ApiResponse =
  HomeResponse |
  LogsResponse |
  ConfigResponse |
  DiagsResponse |
  StatsResponse |
  SchedulesResponse |
  DefaultResponse;

export type ApiItemNotFoundResponse = {
  errorMessage: string;
  itemType: ApiItem;
  itemValue: string;
};

export type ApiInternalErrorResponse = {
  errorMessage: string;
};

export enum ApiItem {
  DEVICE_ID = 'deviceId',
}

export type ApiWithDeviceIdParameterRequest = FastifyRequest<{
  Params: { deviceId: string; }
}>;

export type ApiWithLogsQueryParametersRequest = FastifyRequest<{
  Querystring: { maxNbEvents: number; }
}>;

type DefaultResponse = Record<string, never>;
