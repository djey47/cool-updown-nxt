import { replyWithJson, replyWithItemNotFound } from '../../common/api';
import { getBaseConfig, getDeviceConfig } from '../../common/configuration';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { ApiItem } from '../../models/api';
import { BaseConfig, DeviceConfig } from '../../models/configuration';
import { config, configForDevice } from './config';
import { ConfigResponse } from './models/config';

jest.mock('../../common/api');
jest.mock('../../common/configuration');

const replyWithJsonMock = replyWithJson as jest.Mock;
const replyWithItemNotFoundMock = replyWithItemNotFound as jest.Mock;
const getBaseConfigMock = getBaseConfig as jest.Mock;
const getDeviceConfigMock = getDeviceConfig as jest.Mock;

beforeEach(() => {
  replyWithJsonMock.mockReset();
  replyWithItemNotFoundMock.mockReset();
  getBaseConfigMock.mockReset();
  getDeviceConfigMock.mockReset();
});

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

  const baseConfig: BaseConfig = {
    app: {
      authentication: {
        enabled: false,
        login: 'user',
        password: 'pwd',
      },
      host: '127.0.0.1',
      diagnosticsIntervalMs: 0,
      port: 3001,
    },
    devices: [{
      http: {
        url: 'http://my-nas:5000',
      },
      network: {
        hostname: 'my-nas',
        broadcastIpAddress: '255.255.255.255',
        macAddress: 'aa:bb:cc:dd:ee:ff',
      },
      ssh: {
        keyPath: '/id_rsa',
        password: 'ssh-pwd',
        user: 'ssh-user',
      },
    }],
    defaultSchedules: [],
  };

  describe('config function', () => {
    it('should reply with configuration as JSON', () => {
      // given
      getBaseConfigMock.mockReturnValue({ ...baseConfig });

      // when
      config(defaultReply);

      // then
      const expectedOutput: ConfigResponse = {
        configuration: {
          app: {
            host: '127.0.0.1',
            port: 3001,
            diagnosticsIntervalMs: 0,
            authentication: {
              enabled: false,
              login: '********',
              password: '********',
            },
          },
          devices: [{
            ...deviceConfig,
            ssh: {
              keyPath: '/id_rsa',
              user: '********',
              password: '********',
            },
          }],
          defaultSchedules: [],
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });
  });

  describe('configForDevice function', () => {
    it('should provide configuration as JSON for existing device', () => {
      // given
      getDeviceConfigMock.mockReturnValue({ ...deviceConfig });

      // when
      configForDevice('0', defaultReply);

      // then
      const expectedOutput: ConfigResponse = {
        configuration: {
          ...deviceConfig,
          ssh: {
            keyPath: '/id_rsa',
            user: '********',
            password: '********',
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should provide configuration as JSON for existing device without SSH configuration', () => {
      // given
      const {
        ssh: _sshConfig,
        ...deviceConfigWithoutSSH
      } = deviceConfig;
      getDeviceConfigMock.mockReturnValue(deviceConfigWithoutSSH);

      // when
      configForDevice('0', defaultReply);

      // then
      const expectedOutput: ConfigResponse = {
        configuration: {
          ...deviceConfigWithoutSSH,
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should provide configuration as JSON for existing device, SSH configuration without password', () => {
      // given
      const deviceConfigWithoutSSHPassword: DeviceConfig = {
        ...deviceConfig,
        ssh: {
          keyPath: '/id_rsa',
          user: 'username',
        },
      };
      getDeviceConfigMock.mockReturnValue(deviceConfigWithoutSSHPassword);

      // when
      configForDevice('0', defaultReply);

      // then
      const expectedOutput: ConfigResponse = {
        configuration: {
          ...deviceConfig,
          ssh: {
            keyPath: '/id_rsa',
            user: '********',
          },
        },
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