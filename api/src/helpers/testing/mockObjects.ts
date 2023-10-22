/**
 * Provide convenient mocks for complex objects
 */

import type { FastifyBaseLogger, FastifyInstance, FastifyReply, FastifyReplyContext, FastifyRequest } from 'fastify';
import type { ServerResponse } from 'http';

export function getMockedFastifyReply(codeMock: jest.Mock, sendMock: jest.Mock): FastifyReply {
  return {
    raw: jest.fn() as unknown as ServerResponse,
    context: jest.fn() as unknown as FastifyReplyContext,
    getSerializationFunction: jest.fn(),
    log: jest.fn() as unknown as FastifyBaseLogger,
    send: sendMock,
    code: codeMock,
    status: jest.fn(),
    statusCode: 0,
    sent: false,
    header: jest.fn(),
    headers: jest.fn(),
    getHeader: jest.fn(),
    getHeaders: jest.fn(),
    removeHeader: jest.fn(),
    hasHeader: jest.fn(),
    hijack: jest.fn(),
    callNotFound: jest.fn(),
    getResponseTime: jest.fn(),
    type: jest.fn(),
    serializer: jest.fn(),
    serialize: jest.fn(),
    compileSerializationSchema: jest.fn(),
    then: jest.fn(),
    trailer: jest.fn(),
    hasTrailer: jest.fn(),
    removeTrailer: jest.fn(),
    request: jest.fn() as unknown as FastifyRequest,
    server: jest.fn() as unknown as FastifyInstance,
    redirect: jest.fn(),
    serializeInput: jest.fn(),
  };
}