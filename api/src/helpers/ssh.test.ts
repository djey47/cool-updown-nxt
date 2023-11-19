import globalMocks from '../../config/jest/globalMocks';
import resetMocks from '../../config/jest/resetMocks';
import { sshExec } from './ssh';

import type { DeviceConfig } from '../models/configuration';

jest.mock('./auth', () => globalMocks.authMock);

const { authMock, nodesshMock } = globalMocks;

beforeEach(() => {
  resetMocks();

  authMock.readPrivateKey.mockResolvedValue('=== PRIVATE KEY ===');
  nodesshMock.execCommand.mockResolvedValue({ code: 0, stdout: '/bin /usr/bin\n', stderr: '' });
});

describe('SSH support functions', () => {
  describe('sshExec function', () => {
    const defaultCommand = 'echo $path';
    const defaultDeviceConfig: DeviceConfig = {
      ssh: {
        keyPath: '/key-path',
        password: 'my-pass',
        user: 'user',
      },
      network: {
        broadcastIpAddress: '255.255.255.255',
        hostname: 'hostname',
        macAddress: 'AA:BB:CC:DD:EE:FF',
      },
    };

    it('should execute specified command and return results', async () => {
      // given-when
      const actual = await sshExec(defaultCommand, {...defaultDeviceConfig});

      // then
      expect(nodesshMock.connect).toHaveBeenCalledWith({
        host: 'hostname',
        privateKey: '=== PRIVATE KEY ===',
        username: 'user',
      });
      expect(nodesshMock.execCommand).toHaveBeenCalledWith('echo $path', {});
      expect(actual).toEqual({
        code: 0,
        stderr: '',
        stdout: '/bin /usr/bin\n',
      });
    });

    it('should execute specified command with sudo password and return results', async () => {
      // given-when
      const actual = await sshExec(defaultCommand, {...defaultDeviceConfig}, true);

      // then
      expect(nodesshMock.connect).toHaveBeenCalled();
      expect(nodesshMock.execCommand).toHaveBeenCalledWith('echo $path', { stdin: 'my-pass\n'});
      expect(actual).toEqual({
        code: 0,
        stderr: '',
        stdout: '/bin /usr/bin\n',
      });
    });

    it('should execute specified command without sudo password and return results', async () => {
      // given
      const deviceConfig: DeviceConfig = {
        ...defaultDeviceConfig,
      };
      if (deviceConfig.ssh) {
        deviceConfig.ssh.password = undefined;
      }

      // when
      const actual = await sshExec(defaultCommand, deviceConfig, true);

      // then
      expect(nodesshMock.connect).toHaveBeenCalled();
      expect(nodesshMock.execCommand).toHaveBeenCalledWith('echo $path', {});
      expect(actual).toEqual({
        code: 0,
        stderr: '',
        stdout: '/bin /usr/bin\n',
      });
    });
  });
});
