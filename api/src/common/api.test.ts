import { replyWithJson, replyWithItemNotFound } from './api';
import { getMockedFastifyReply } from '../helpers/testing/mockObjects';

import type { FastifyReply } from 'fastify';
import { ApiItem, type ApiResponse } from '../models/api';

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
  
  describe('replyWithItemNotFound function', () => {
    const codeMock = jest.fn();
    const sendMock = jest.fn();
    const defaultReply = getMockedFastifyReply(codeMock, sendMock); 

    beforeEach(() => {
      codeMock.mockReset();
      sendMock.mockReset();
    })

    it('should reply with correct error', () => {
      // given
      codeMock.mockReturnValue(defaultReply);
      const reply: FastifyReply = defaultReply;

      // when
      replyWithItemNotFound(reply, ApiItem.DEVICE_ID, 'value');

      // then
      expect(codeMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock).toHaveBeenCalledWith({
        errorMessage: 'Specified item was not found',
        itemType: 'deviceId',
        itemValue: 'value',
      });
    });    
  });
});
