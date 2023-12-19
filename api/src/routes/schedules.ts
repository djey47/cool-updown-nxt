import { schedules, schedulesForDevice } from '../services/schedules/schedules';

import type { FastifyInstance } from 'fastify/types/instance';
import type { FastifyReply } from 'fastify/types/reply';
import type { ApiWithDeviceIdParameterRequest } from '../models/api';

export function schedulesRoutes(app: FastifyInstance) {
  app.get('/schedules', (_req, reply) => {
    schedules(reply);
  });

  app.get('/device-schedules/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    schedulesForDevice(deviceId, reply);
  });

}
