import { ApiWithLogsQueryParametersRequest } from '../models/api';
import { logs } from '../services/logs/logs';

import type { FastifyInstance } from 'fastify/types/instance';

export function logsRoutes(app: FastifyInstance) {
  app.get('/logs', (req: ApiWithLogsQueryParametersRequest, reply) => {
    const maxNbEvents = req.query?.maxNbEvents;
    logs(maxNbEvents, reply);
  });
}
