import type { HomeResponse } from '../services/home/models/home';
import type { LogsResponse } from '../services/logs/models/logs';
import type { ConfigResponse } from '../services/config/models/config';

export type ApiResponse = HomeResponse | LogsResponse | ConfigResponse;
 