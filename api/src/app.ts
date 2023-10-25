
/** Web application back-end entry point */
import appRootDir from 'app-root-dir';
import fastify from 'fastify';
import fastifyStaticPlugin from '@fastify/static';
import path from 'path';
import { home } from './services/home/home';
import { coreLogger, getLoggerConfig } from './common/logger';
import { logs } from './services/logs/logs';
import { getConfig } from './common/configuration';
import { config } from './services/config/config';
import { diag } from './processors/diag/diag';
import { diags } from './services/diags/diags';

const app = async () => {
  const app = fastify({
    logger: getLoggerConfig(),
  });

  app.register(fastifyStaticPlugin, {
    root: path.join(appRootDir.get(), '..', 'web', 'dist'),
    prefix: '/ui/',
  });  
  
  // TODO error management

  app.get('/', (_req, reply) => {
    home(reply);
  });

  app.get('/logs', (_req, reply) => {
    logs(reply);
  });

  app.get('/config', (_req, reply) => {
    // req.log.trace('TRACE Some info about the current request')

    config(reply);
  });

  app.get('/diags', (_req, reply) => {
    diags(reply);
  });

  // Must match the vite config file
  if (import.meta.env.PROD) {
    const config = getConfig();
    const { host, port } = config.app;
    app.listen({ port, host });

    coreLogger.info('cool-updown-nxt API running on port %s, host %s', port, host);
  }

  // Start diagnostics processor
  diag();
 
  return app;
};

export const viteNodeApp = app();
