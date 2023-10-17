import { replyWithJson } from '../../common/api';
import { getBaseConfig } from '../../common/configuration';

import type { FastifyReply } from 'fastify/types/reply';
import { ConfigResponse } from './models/config';

export function config(reply: FastifyReply) {
  const output: ConfigResponse = {
    configuration: getBaseConfig(),
  };
  // TODO obfuscate sensitive parameters
  replyWithJson(reply, output);
}
