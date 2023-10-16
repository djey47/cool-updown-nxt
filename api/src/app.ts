
/** Web application back-end entry point */
import fastify from 'fastify';
import { home } from './services/home/home';
import { coreLogger, getLoggerConfig } from './common/logger';
import { logs } from './services/logs/logs';

const app = async () => {
  // TODO error management
  const app = fastify({
    logger: getLoggerConfig(),
  });

  app.get('/', (_req, reply) => {
    home(reply);
  });

  app.get('/logs', (_req, reply) => {
    // req.log.trace('TRACE Some info about the current request')

    logs(reply);
  });

  // Must match the vite config file
  if (import.meta.env.PROD) {
    // TODO Port and host should be taken from config
    const port = 3001;
    const host = '0.0.0.0';
    app.listen({ port, host });

    coreLogger.info('cool-updown-nxt API running on port %s', port);
  } 
 
  return app;
};

export const viteNodeApp = app();
