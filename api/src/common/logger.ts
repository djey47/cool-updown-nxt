import appRootDir from 'app-root-dir';
import path from 'path';
import pino from 'pino';

import type { FastifyLoggerOptions, PinoLoggerOptions } from 'fastify/types/logger';

export function getLoggerConfig(): boolean | FastifyLoggerOptions | PinoLoggerOptions {
  return {
    level: 'info',
    // TODO use project logs folder
    file: path.join(appRootDir.get(), 'logs', 'cool-updown-nxt.log'),
  }
}

/**
 * Logs to console (as neither fastifiy.log nor logger properties do not seem to be available)
 */
export const coreLogger = pino();
