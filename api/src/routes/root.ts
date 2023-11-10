import { home } from '../services/home/home';

import type { FastifyInstance } from 'fastify/types/instance';

export function rootRoutes(app: FastifyInstance) {
  app.get('/', (_req, reply) => {
    home(reply);
  });
}
