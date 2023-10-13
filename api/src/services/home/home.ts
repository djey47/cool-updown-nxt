import { FastifyReply } from 'fastify';
import { AppContext } from '../../common/context';
import { replyWithJson } from '../../common/api';
import projectPackage from '../../../package.json';

import type { HomeResponse } from './models/home';

/**
 * Home service implementation
 */
export function home(reply: FastifyReply) {
  const { name, version } = projectPackage;

  // TODO expose configuration
  const output: HomeResponse = {
    package: {
      name,
      version,
    },
    context: AppContext.get(),
  };
  replyWithJson(reply, output);
}
