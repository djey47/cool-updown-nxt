
/** Web application back-end entry point */

import fastify from 'fastify';
import { home } from './services/home/home';

const app = async () => {
  const app = fastify();

  app.get('/', (_req, reply) => {
    home(reply);
  });

  // Must match the vite config file
  if (import.meta.env.PROD) {
    // TODO Port should be taken from config
    const port = 3001;
    app.listen({ port });

    // TODO Proper logs system
    console.log('cool-updown-nxt API running on port', port);
  } 
 
  return app;
};

export const viteNodeApp = app();