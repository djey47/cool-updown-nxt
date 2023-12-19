import routes from './index';
import { getMockedFastifyApp } from '../helpers/testing/mockObjects';
import { configRoutes } from './config';
import { diagsRoutes } from './diags';
import { logsRoutes } from './logs';
import { powerRoutes } from './power';
import { rootRoutes } from './root';
import { schedulesRoutes } from './schedules';
import { statsRoutes } from './stats';

import type { FastifyInstance } from 'fastify/types/instance';

jest.mock('./config');
jest.mock('./diags');
jest.mock('./logs');
jest.mock('./power');
jest.mock('./root');
jest.mock('./schedules');
jest.mock('./stats');

const configRoutesMock = configRoutes as jest.Mock<void, [FastifyInstance]>;
const diagsRoutesMock = diagsRoutes as jest.Mock<void, [FastifyInstance]>;
const logsRoutesMock = logsRoutes as jest.Mock<void, [FastifyInstance]>;
const powerRoutesMock = powerRoutes as jest.Mock<void, [FastifyInstance]>;
const rootRoutesMock = rootRoutes as jest.Mock<void, [FastifyInstance]>;
const schedulesRoutesMock = schedulesRoutes as jest.Mock<void, [FastifyInstance]>;
const statsRoutesMock = statsRoutes as jest.Mock<void, [FastifyInstance]>;

describe('routes index', () => {
  const app = getMockedFastifyApp();

  it('should register all routes', () => {
    // given-when
    routes(app);

    // then
    expect(configRoutesMock).toHaveBeenCalledWith(app);
    expect(diagsRoutesMock).toHaveBeenCalledWith(app);
    expect(logsRoutesMock).toHaveBeenCalledWith(app);
    expect(powerRoutesMock).toHaveBeenCalledWith(app);
    expect(rootRoutesMock).toHaveBeenCalledWith(app);
    expect(schedulesRoutesMock).toHaveBeenCalledWith(app);
    expect(statsRoutesMock).toHaveBeenCalledWith(app);
  });
});
