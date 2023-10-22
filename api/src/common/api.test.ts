import { replyWithJson } from './api';

import type { FastifyReply } from 'fastify';
import type { ApiResponse } from '../models/api';
import { getMockedFastifyReply } from '../helpers/testing/mockObjects';

describe('Common API functions', () => {
  describe('replyWithJson function', () => {
    const codeMock = jest.fn();
    const sendMock = jest.fn();
    const defaultReply = getMockedFastifyReply(codeMock, sendMock); 

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
