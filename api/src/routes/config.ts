import { config, configForDevice } from '../services/config/config';

import type { FastifyInstance } from 'fastify/types/instance';
import type { FastifyReply } from 'fastify/types/reply';
import type { ApiWithDeviceIdParameterRequest } from '../models/api';

export function configRoutes(app: FastifyInstance) {
  app.get('/config', (_req, reply) => {
    // req.log.trace('TRACE Some info about the current request')

    config(reply);
  });

  app.get('/config/:deviceId', (req: ApiWithDeviceIdParameterRequest, reply: FastifyReply) => {
    const { params: { deviceId } } = req;
    configForDevice(deviceId, reply);
  });

}
