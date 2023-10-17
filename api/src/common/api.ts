import type { FastifyReply } from 'fastify/types/reply';
import type { ApiResponse } from '../models/api';

export function replyWithJson(reply: FastifyReply, item?: ApiResponse) {
  if (item) {
    reply
      .send(item);
  } else {
    reply
      .code(204)
      .send();
  }
}
