
/** Web application back-end entry point */
import appRootDir from 'app-root-dir';
import fastify from 'fastify';
import fastifyStaticPlugin from '@fastify/static';
import fastifyGracefulShutdownPlugin from 'fastify-graceful-shutdown';
import path from 'path';
import { coreLogger, getLoggerConfig } from './common/logger';
import { getConfig } from './common/configuration';
import { diagProcessor } from './processors/diag/diag';
import { AppContext } from './common/context';
import { contextProcessor } from './processors/context/context';
import { rootRoutes } from './routes/root';
import { logsRoutes } from './routes/logs';
import { configRoutes } from './routes/config';
import { diagsRoutes } from './routes/diags';
import { statsRoutes } from './routes/stats';
import { powerRoutes } from './routes/power';

const IS_PRODUCTION = !!import.meta.env.PROD;

function initAppInfo() {
  // Update app start date
  const { appInfo } = AppContext.get();
  appInfo.lastStartOn = new Date();
}

const app = async () => {
  const app = fastify({
    logger: getLoggerConfig(),
  });

  // Plugins
  app.register(fastifyStaticPlugin, {
    root: path.join(appRootDir.get(), '..', 'web', 'dist'),
    prefix: '/ui/',
  });
  if (IS_PRODUCTION) {
    // As this plugin is incompatible with vite in development
    app.register(fastifyGracefulShutdownPlugin);
  }

  // TODO critical error management

  // Routes
  rootRoutes(app);

  logsRoutes(app);

  configRoutes(app);

  diagsRoutes(app);

  statsRoutes(app);

  powerRoutes(app);

  // Shutdown management
  app.after(() => {
    if (IS_PRODUCTION) {
      // As this plugin is incompatible with vite during development
      app.gracefulShutdown(async (signal, next) => {
        app.log.info('cool-updown-nxt received signal %s, server will terminate', signal);
  
        // Should persist context
        await contextProcessor()
  
        next();
      });  
    }
  })

  // Must match the vite config file
  if (IS_PRODUCTION) {
    const config = getConfig();
    const { host, port } = config.app;
    app.listen({ port, host });

    coreLogger.info('cool-updown-nxt API running on port %s, host %s', port, host);
  }

  // Start context processor - should always be the 1st thing to do
  await contextProcessor(true);

  initAppInfo();

  // Start diagnostics processor
  await diagProcessor();
  return app;
};

export const viteNodeApp = app();
