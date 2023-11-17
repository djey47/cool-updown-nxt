import { FastifyReply } from 'fastify/types/reply';
import { powerOnForDevice } from '../services/power/powerOn';
import { powerOffForDevice } from '../services/power/powerOff';

import type { FastifyInstance } from 'fastify/types/instance';
import type { ApiWithDeviceIdParameterRequest } from '../models/api';

export function powerRoutes(app: FastifyInstance) {
  app.post('/power-on/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    powerOnForDevice(deviceId, reply);
  });

  app.post('/power-off/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    powerOffForDevice(deviceId, reply);
  });
}
