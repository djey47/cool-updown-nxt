import { FastifyReply } from 'fastify/types/reply';
import { replyWithJson, replyWithItemNotFound } from '../../common/api';
import { getBaseConfig } from '../../common/configuration';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { validateDeviceIdentifier } from '../common/validators';
import { config, configForDevice } from './config';

import type { BaseConfig, DeviceConfig } from '../../models/configuration';
import type { ConfigResponse } from './models/config';

jest.mock('../../common/api');
jest.mock('../../common/configuration');
jest.mock('../common/validators');

const replyWithJsonMock = replyWithJson as jest.Mock;
const replyWithItemNotFoundMock = replyWithItemNotFound as jest.Mock;
const getBaseConfigMock = getBaseConfig as jest.Mock;
const validateDeviceIdentifierMock = validateDeviceIdentifier as jest.Mock<DeviceConfig, [string, FastifyReply?]>;

beforeEach(() => {
  replyWithJsonMock.mockReset();
  replyWithItemNotFoundMock.mockReset();
  getBaseConfigMock.mockReset();
  validateDeviceIdentifierMock.mockReset();
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
    devices: [{ ...deviceConfig }],
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
      validateDeviceIdentifierMock.mockReturnValue({ ...deviceConfig });

      // when
      configForDevice('0', defaultReply);

      // then
      expect(validateDeviceIdentifierMock).toHaveBeenCalledWith('0', defaultReply);
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
      validateDeviceIdentifierMock.mockReturnValue({ ...deviceConfigWithoutSSH });

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
      validateDeviceIdentifierMock.mockReturnValue({ ...deviceConfigWithoutSSHPassword });

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
      expect(validateDeviceIdentifierMock).toHaveBeenCalledWith('foo', defaultReply);
      expect(replyWithJsonMock).not.toHaveBeenCalled();
      expect(replyWithItemNotFoundMock).not.toHaveBeenCalled();
    });
  });
});