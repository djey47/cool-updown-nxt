import { readFile } from 'fs/promises';
import fastifyBasicAuthPlugin from '@fastify/basic-auth';

import type { AuthConfig } from '../models/configuration';
import type { FastifyInstance } from 'fastify/types/instance';
import type { FastifyRequest } from 'fastify/types/request';
import type { FastifyReply } from 'fastify/types/reply';

/**
 * @return Promise which resolves to String,
 * with the contents of SSH private key as per provided keyPath
 */
export async function readPrivateKey(privateKeyPath?: string) {
  if(!privateKeyPath) {
    return undefined;
  }
  const privateKey = await readFile(privateKeyPath, 'utf-8');

  // console.log('auth::readPrivateKey', { privateKeyPath, privateKey });

  return privateKey;
}

/**
 * Invokes basic auth plugin to provide authentication capabilities when required
 * @param app 
 * @param authConfiguration 
 */
export function initAppAuthentication(app: FastifyInstance, authConfiguration?: AuthConfig) {
  if (!authConfiguration) {
    app.log.warn('Authentication configuration is not available; please consider adding one.');
    return;
  }

  const { enabled, login: appLogin, password: appPassword } = authConfiguration;
  if (!enabled) {
    app.log.warn('Authentication is currently disabled!');
    return;
  }

  const validate = (username: string, password: string, _req: FastifyRequest, _reply: FastifyReply, done: (err?: Error) => void) => {
    if (username === appLogin && password === appPassword) {
      app.log.debug('User %s authenticated succesfully.', appLogin);
      done();
    } else {
      app.log.error('Authentication failed for user %s.', appLogin);
      done(new Error('Authentication failed!'));
    }
  };

  const authenticate = { realm: 'cud-nxt' };
  app.register(fastifyBasicAuthPlugin, { validate, authenticate });
}
