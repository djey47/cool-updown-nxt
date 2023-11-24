import { replyWithJson, replyWithItemNotFound } from '../../common/api';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { ApiItem } from '../../models/api';
import { DeviceConfig } from '../../models/configuration';
import { config, configForDevice } from './config';
import { ConfigResponse } from './models/config';

jest.mock('../../common/api');

const replyWithJsonMock = replyWithJson as jest.Mock;
const replyWithItemNotFoundMock = replyWithItemNotFound as jest.Mock;

describe('Configuration service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  const deviceConfig: DeviceConfig = {
    network: {
      broadcastIpAddress: '255.255.255.255',
      hostname: 'my-nas',
      macAddress: 'aa:bb:cc:dd:ee:ff',
    },
    ssh: {
      keyPath: '/id_rsa',
      password: 'pwd',
      user: 'username',
    },
    http: {
      url: 'http://my-nas:5000',
    },
  };

  beforeEach(() => {
    replyWithJsonMock.mockReset();
    replyWithItemNotFoundMock.mockReset();
  })

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
          devices: [deviceConfig],
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });
  });

  describe('configForDevice function', () => {
    it('should provide configuration as JSON for existing device', () => {
      // given-when
      configForDevice('0', defaultReply);

      // then
      const expectedOutput: ConfigResponse = {
        configuration: deviceConfig,
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should reply with 404 when no config for specified device', async () => {
      // given-when
      await configForDevice('foo', defaultReply);

      // then
      expect(replyWithJsonMock).not.toHaveBeenCalled();
      expect(replyWithItemNotFoundMock).toHaveBeenCalledWith(defaultReply, ApiItem.DEVICE_ID, 'foo');
    });
  });
});