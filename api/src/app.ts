
/** Web application back-end entry point */

import fastify from 'fastify';
import { home } from './services/home/home';
import { getLoggerConfig } from './common/logger';

const app = async () => {
  const app = fastify({
    logger: getLoggerConfig(),
  });

  app.get('/', (req, reply) => {
    // req.log.info('Some info about the current request')

    home(reply);
  });

  // Must match the vite config file
  if (import.meta.env.PROD) {
    // TODO Port and host should be taken from config
    const port = 3001;
    const host = '0.0.0.0';
    app.listen({ port, host });

    // TODO Proper logs system
    console.log('cool-updown-nxt API running on port', port);
  } 
 
  return app;
};

export const viteNodeApp = app();