import { replyWithJson } from '../../common/api';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { config } from './config';
import { ConfigResponse } from './models/config';

jest.mock('../../common/api');

const replyWithJsonMock = replyWithJson as jest.Mock;

describe('Configuration service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  describe('config function', () => {
    it('should reply with configuration as JSON', () => {
      // given-when
      config(defaultReply);

      // then
      const expectedOutput: ConfigResponse = {
        configuration: {
          app: {
            host: '127.0.0.1',
            port: 3001,
            diagnosticsIntervalMs: 0
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });
  });
});