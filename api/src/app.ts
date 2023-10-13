
/** Web application back-end entry point */

import fastify from 'fastify';

const app = async () => {
  const app = fastify();

  app.get('/', (req, reply) => {
    reply.send(`Hello World, that is cool-updown-nxt API!\n${JSON.stringify(import.meta, null, 2)}`);
  });

  app.get('/ping', (req, reply) => {
    reply.send({ msg: 'pong' });
  });

  app.get('/pong', (req, reply) => {
    reply.send({ msg: 'ping' });
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