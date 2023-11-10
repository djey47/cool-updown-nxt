import { FastifyReply } from 'fastify/types/reply';
import { diags, diagsForDevice } from '../services/diags/diags';

import type { FastifyInstance } from 'fastify/types/instance';
import type { ApiWithDeviceIdParameterRequest } from '../models/api';

export function diagsRoutes(app: FastifyInstance) {
  app.get('/diags', (_req, reply) => {
    diags(reply);
  });

  app.get('/diags/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    diagsForDevice(deviceId, reply);
  });
}
