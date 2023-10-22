import appRootDir from 'app-root-dir';
import path from 'path';
import pino from 'pino';

import type { FastifyLoggerOptions, PinoLoggerOptions } from 'fastify/types/logger';

/**
 * @returns common logger configuration
 */
export function getLoggerConfig(): boolean | FastifyLoggerOptions | PinoLoggerOptions {
  return {
    level: 'info',
    // TODO use project logs folder
    file: path.join(appRootDir.get(), 'logs', 'cool-updown-nxt.log'),
  };
}

/**
 * Logs to console (as neither fastifiy.log nor logger properties do not seem to be available)
 * TODO check configuration to apply same properties
 */
export const coreLogger = pino();
