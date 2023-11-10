import { config } from '../services/config/config';

import type { FastifyInstance } from 'fastify/types/instance';

export function configRoutes(app: FastifyInstance) {
  app.get('/config', (_req, reply) => {
    // req.log.trace('TRACE Some info about the current request')

    config(reply);
  });
}
