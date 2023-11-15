import globalMocks from '../../config/jest/globalMocks';
import resetMocks from '../../config/jest/resetMocks';
import { getSSHParameters } from './ssh';

import type { DeviceConfig } from '../models/configuration';

jest.mock('./auth', () => globalMocks.authMock);

const { authMock } = globalMocks;

beforeEach(() => {
  resetMocks();
});

describe('SSH support functions', () => {
  describe('getSSHParameters function', () => {
    const defaultServerConfig: DeviceConfig = {
      ssh: {
        keyPath: '/key-path',
        user: 'user',
      },
      network: {
        broadcastIpAddress: '255.255.255.255',
        hostname: 'hostname',
        macAddress: 'AA:BB:CC:DD:EE:FF',
      },
    };

    it('should return right connection params', async () => {
      // given
      authMock.readPrivateKey.mockResolvedValue('=== PRIVATE KEY ===');

      // when
      const actual = await getSSHParameters({ ...defaultServerConfig });

      // then
      expect(actual).toEqual({
        host: 'hostname',
        privateKey: '=== PRIVATE KEY ===',
        username: 'user',
      });
    });

    it('should handle no SSH configuration section', async () => {
      // given
      const config: DeviceConfig = {
        ...defaultServerConfig,
        ssh: undefined,
      };

      // when
      const actual = await getSSHParameters(config);

      // then
      expect(actual).toEqual({
        host: 'hostname',
      });
    });
  });
});
