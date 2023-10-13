import appRootDir from 'app-root-dir';

import type { FastifyLoggerOptions } from 'fastify/types/logger';
import path from 'path';

export function getLoggerConfig(): boolean | FastifyLoggerOptions {
  return {
    level: 'info',
    // TODO use project logs folder
    file: path.join(appRootDir.get(), 'logs', 'cool-updown-nxt.log'),
  }
}