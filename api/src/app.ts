
/** Web application back-end entry point */
import appRootDir from 'app-root-dir';
import fastify from 'fastify';
import fastifyStaticPlugin from '@fastify/static';
import fastifyGracefulShutdownPlugin from 'fastify-graceful-shutdown';
import path from 'path';
import { home } from './services/home/home';
import { coreLogger, getLoggerConfig } from './common/logger';
import { logs } from './services/logs/logs';
import { getConfig } from './common/configuration';
import { config } from './services/config/config';
import { diagProcessor } from './processors/diag/diag';
import { diags, diagsForDevice } from './services/diags/diags';
import { AppContext } from './common/context';
import { stats, statsForDevice } from './services/stats/stats';
import { powerOnForDevice } from './services/power/powerOn';
import { contextProcessor } from './processors/context/context';

import type { ApiWithDeviceIdParameterRequest } from './models/api';
import type { FastifyReply } from 'fastify/types/reply';

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
  app.register(fastifyGracefulShutdownPlugin);

  // TODO critical error management

  // Routes
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

  app.get('/diags/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    diagsForDevice(deviceId, reply);
  })

  app.get('/stats', (_req, reply) => {
    stats(reply);
  });

  app.get('/stats/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    statsForDevice(deviceId, reply);
  });

  app.post('/power-on/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    powerOnForDevice(deviceId, reply);
  });

  // Shutdown management
  app.after(() => {
    app.gracefulShutdown(async (signal, next) => {
      app.log.info('cool-updown-nxt received signal %s, server will terminate', signal);

      // Should persist context
      await contextProcessor()

      next();
    });
  })

  // Must match the vite config file
  if (import.meta.env.PROD) {
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
