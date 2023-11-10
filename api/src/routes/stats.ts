import { FastifyReply } from 'fastify/types/reply';
import { stats, statsForDevice } from '../services/stats/stats';

import type { FastifyInstance } from 'fastify/types/instance';
import type { ApiWithDeviceIdParameterRequest } from '../models/api';

export function statsRoutes(app: FastifyInstance) {
  app.get('/stats', (_req, reply) => {
    stats(reply);
  });

  app.get('/stats/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    statsForDevice(deviceId, reply);
  });
}
