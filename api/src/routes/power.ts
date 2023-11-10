import { FastifyReply } from 'fastify/types/reply';
import { powerOnForDevice } from '../services/power/powerOn';

import type { FastifyInstance } from 'fastify/types/instance';
import type { ApiWithDeviceIdParameterRequest } from '../models/api';

export function powerRoutes(app: FastifyInstance) {
  app.post('/power-on/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    powerOnForDevice(deviceId, reply);
  });
}
