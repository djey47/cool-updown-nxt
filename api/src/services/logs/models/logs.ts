import type { LogLevel } from 'fastify/types/logger';

interface RequestLogEntry {
  method: string;
  url: string;
  hostname: string;
  remoteAddress: string;
  remotePort: number;
}

interface ResponseLogEntry {
  statusCode: number;
}

export interface LogEntry {
  level?: LogLevel,
  time: number;
  requestId?: string;
  request?: RequestLogEntry;
  response?: ResponseLogEntry;
  responseTimeSeconds: BigInt;
  message: string;
}

export interface LogsResponse {
  entryCount: number;
  logs: LogEntry[];
  fileSizeBytes: number;
}
