import { configRoutes } from './config';
import { diagsRoutes } from './diags';
import { logsRoutes } from './logs';
import { powerRoutes } from './power';
import { rootRoutes } from './root';
import { schedulesRoutes } from './schedules';
import { statsRoutes } from './stats';

import type { FastifyInstance } from 'fastify/types/instance';

export default function initRoutes(app: FastifyInstance) {
  rootRoutes(app);

  logsRoutes(app);

  configRoutes(app);

  diagsRoutes(app);

  statsRoutes(app);

  powerRoutes(app);

  schedulesRoutes(app);
}
