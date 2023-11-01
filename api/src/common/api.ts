import type { FastifyReply } from 'fastify/types/reply';
import type { ApiItem, ApiItemNotFoundResponse, ApiResponse } from '../models/api';

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

export function replyWithItemNotFound(reply: FastifyReply, itemType: ApiItem, itemValue: string) {
  const responseItem: ApiItemNotFoundResponse = {
    errorMessage: 'Specified item was not found',
    itemType,
    itemValue, 
  };
  reply
    .code(404)
    .send(responseItem);
}
