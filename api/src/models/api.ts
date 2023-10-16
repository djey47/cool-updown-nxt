import type { HomeResponse } from '../services/home/models/home';
import type { LogsResponse } from '../services/logs/models/logs';

export type ApiResponse = HomeResponse | LogsResponse;
 