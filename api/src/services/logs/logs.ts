import { readFile, stat } from 'fs/promises';
import { replyWithJson } from '../../common/api';
import { getLoggerConfig } from '../../common/logger';

import type { FastifyReply } from 'fastify/types/reply';
import type { FastifyLoggerOptions } from 'fastify/types/logger';
import type { LogLevel } from 'fastify/types/logger';
import type { LogEntry, LogsResponse } from './models/logs';

/**
 * Logs service implementation
 */
export async function logs(reply: FastifyReply) {
  const loggerConfig = getLoggerConfig() as FastifyLoggerOptions;
  if (!loggerConfig.file) {
    replyWithJson(reply);
    return;
  }

  const logFilePath = loggerConfig.file;
  const logsFileStats = await stat(logFilePath);
  const logsContents = await readLogs(logFilePath);
  
  console.log('logs::logs', { logsContents });
  
  const logs = parseLogs(logsContents);

  // TODO filtering
  const output: LogsResponse = {
    entryCount: logs.length,
    logs,
    fileSizeBytes: logsFileStats.size,
  };

  replyWithJson(reply, output);
}

async function readLogs(logFilePath: string) {
  const contents = await readFile(logFilePath, { encoding: 'utf-8'});

  console.log('logs::readLogs', { contents });

  return contents.split(/\r?\n/);
}

function parseLogs(contents: string[]) {
  return contents
    // Discard empty line at ending
    .filter((c) => c)
    .map((c): LogEntry => {
      const pinoLogEntry = JSON.parse(c);
      return {
        level: parsePinoLogLevel(pinoLogEntry.level),
        message: pinoLogEntry.msg,
        time: pinoLogEntry.time,
        responseTimeSeconds: pinoLogEntry.responseTime,
        requestId: pinoLogEntry.reqId,
        request: pinoLogEntry.req,
        response: pinoLogEntry.res,
      };
    })
    // Most recent events first
    .sort((parsed1, parsed2) => parsed2.time - parsed1.time);
}

function parsePinoLogLevel(level: number): LogLevel | undefined {
  switch (level) {
    case 10: 
      return 'trace';
    case 20: 
      return 'debug';
    case 30: 
      return 'info';
    case 40: 
      return 'warn';
    case 50: 
      return 'error';
    case 60: 
      return 'fatal';
    default:
      return undefined;
  }
}
