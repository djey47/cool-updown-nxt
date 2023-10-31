import type { HomeResponse } from '../services/home/models/home';
import type { LogsResponse } from '../services/logs/models/logs';
import type { ConfigResponse } from '../services/config/models/config';
import type { DiagsResponse } from '../services/diags/models/diags';
import type { StatsResponse } from '../services/stats/models/stats';

export type ApiResponse = HomeResponse | LogsResponse | ConfigResponse | DiagsResponse | StatsResponse | DefaultResponse;

type DefaultResponse = Record<string, never>;

 