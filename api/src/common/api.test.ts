import { replyWithJson } from './api';

import type { ServerResponse } from 'http';
import type { FastifyReply, FastifyReplyContext, FastifyBaseLogger, FastifyRequest, FastifyInstance } from 'fastify';
import type { ApiResponse } from '../models/api';

describe('Common API functions', () => {
  describe('replyWithJson function', () => {
    const sendMock = jest.fn();
    const codeMock = jest.fn();
    const defaultReply: FastifyReply = {
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

    beforeEach(() => {
      codeMock.mockReset();
      sendMock.mockReset();
    })

    it('should reply provided object', () => {
      // given
      const reply: FastifyReply = defaultReply;
      const item: ApiResponse = {};

      // when
      replyWithJson(reply, item);

      // then
      expect(codeMock).not.toHaveBeenCalled();
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({});
    });    
    
    it('should reply a 204 with empty response', () => {
      // given
      codeMock.mockReturnValue(defaultReply);
      const reply: FastifyReply = defaultReply;

      // when
      replyWithJson(reply);

      // then
      expect(codeMock).toHaveBeenCalledTimes(1);
      expect(codeMock).toHaveBeenCalledWith(204);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith();
    });
  });
});
