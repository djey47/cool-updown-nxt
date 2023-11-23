import globalMocks from '../../../config/jest/globalMocks';
import { replyWithJson } from '../../common/api';
import { getFileStats, getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { logs } from './logs';
import { LogsResponse } from './models/logs';
import { getLoggerConfig } from '../../common/logger';
import { FastifyLoggerOptions } from 'fastify';

jest.mock('../../common/api');
jest.mock('../../common/logger');

const { node: { fsMock }} = globalMocks;
const replyWithJsonMock = replyWithJson as jest.Mock;
const getLoggerConfigMock = getLoggerConfig as jest.Mock;

describe('logs service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  describe('logs async function', () => {
    const defaultLoggerConfig: FastifyLoggerOptions = {};
    const loggerConfigToFile: FastifyLoggerOptions = {
      ...defaultLoggerConfig,
      file: '/tmp/app.log',
    };

    it('should send logs from file', async () => {
      // given
      getLoggerConfigMock.mockReturnValue(loggerConfigToFile);
      fsMock.stat.mockResolvedValue(getFileStats(2500));
      const logContents = `{"level":30,"time":1697222344880,"pid":5493,"hostname":"host","reqId":"req-1","req":{"method":"GET","url":"/","hostname":"localhost:3000","remoteAddress":"127.0.0.1","remotePort":44316},"msg":"message1"}\n
      {"level":40,"time":1697222344882,"pid":5493,"hostname":"host","reqId":"req-1","res":{"statusCode":200},"responseTime":1.8060580000746995,"msg":"message2"}`;
      fsMock.readFile.mockResolvedValue(logContents);

      // when
      await logs(undefined, defaultReply);

      // then
      const expectedOutput: LogsResponse = {
        entryCount: 2,
        totalEntryCount: 2,
        logs: [{
          time: 1697222344882,
          message: 'message2',
          responseTimeSeconds: 1.8060580000746995 as unknown as bigint,
          level: 'warn',
          request: undefined,
          requestId: 'req-1',
          response: {
            statusCode: 200,
          },
        }, {
          time: 1697222344880,
          message: 'message1',
          responseTimeSeconds: undefined,
          level: 'info',
          request: {
            hostname: 'localhost:3000',
            method: 'GET',
            remoteAddress: '127.0.0.1',
            remotePort: 44316,
            url: '/',
          },
          requestId: 'req-1',
          response: undefined,
        }],
        fileSizeBytes: 2500
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should send logs from file, using event count limiter', async () => {
      // given
      getLoggerConfigMock.mockReturnValue(loggerConfigToFile);
      fsMock.stat.mockResolvedValue(getFileStats(2500));
      const logContents = `{"level":30,"time":1697222344880,"pid":5493,"hostname":"host","reqId":"req-1","req":{"method":"GET","url":"/","hostname":"localhost:3000","remoteAddress":"127.0.0.1","remotePort":44316},"msg":"message1"}\n
      {"level":40,"time":1697222344882,"pid":5493,"hostname":"host","reqId":"req-1","res":{"statusCode":200},"responseTime":1.8060580000746995,"msg":"message2"}`;
      fsMock.readFile.mockResolvedValue(logContents);

      // when
      await logs(1, defaultReply);

      // then
      const expectedOutput: LogsResponse = {
        entryCount: 1,
        totalEntryCount: 2,
        logs: [{
          time: 1697222344882,
          message: 'message2',
          responseTimeSeconds: 1.8060580000746995 as unknown as bigint,
          level: 'warn',
          request: undefined,
          requestId: 'req-1',
          response: {
            statusCode: 200,
          },
        }],
        fileSizeBytes: 2500
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should send logs from file with unsupported log level', async () => {
      // given
      getLoggerConfigMock.mockReturnValue(loggerConfigToFile);
      fsMock.stat.mockResolvedValue(getFileStats(2500));
      const logContents = '{"level":0,"time":1697222344880,"pid":5493,"hostname":"host","reqId":"req-1","req":{"method":"GET","url":"/","hostname":"localhost:3000","remoteAddress":"127.0.0.1","remotePort":44316},"msg":"message1"}\n';
      fsMock.readFile.mockResolvedValue(logContents);

      // when
      await logs(undefined, defaultReply);

      // then
      const expectedOutput: LogsResponse = {
        entryCount: 1,
        totalEntryCount: 1,
        logs: [{
          time: 1697222344880,
          message: 'message1',
          responseTimeSeconds: undefined,
          level: 'silent',
          request: {
            hostname: 'localhost:3000',
            method: 'GET',
            remoteAddress: '127.0.0.1',
            remotePort: 44316,
            url: '/',
          },
          requestId: 'req-1',
          response: undefined,
        }],
        fileSizeBytes: 2500
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should send without contents if no file available in logger config', async () => {
      // given
      getLoggerConfigMock.mockReturnValue(defaultLoggerConfig);

      // when
      await logs(undefined, defaultReply);

      // then
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply);
    });
  });
});