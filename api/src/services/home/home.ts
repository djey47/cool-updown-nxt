import { AppContext } from '../../common/context';
import { replyWithJson } from '../../common/api';
import projectPackage from '../../../package.json';

import type { FastifyReply } from 'fastify/types/reply';
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
    context: AppContext.getWithoutInternals(),
  };
  replyWithJson(reply, output);
}
