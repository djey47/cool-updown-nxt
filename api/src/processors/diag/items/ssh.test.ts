import { sshExec } from '../../../helpers/ssh';
import { sshDiag } from './ssh';

import type { DeviceConfig } from '../../../models/configuration';
import type { SSHExecCommandResponse } from 'node-ssh';

jest.mock('../../../helpers/ssh');

const sshExecMock = sshExec as jest.Mock<Promise<SSHExecCommandResponse>>;

describe('ssh diag item', () => {
  describe('sshDiag function', () => {
    const defaultDeviceConfig: DeviceConfig = {
      network: {
        broadcastIpAddress: '255.255.255.255',
        hostname: 'host-name',
        macAddress: 'aa:bb:cc:dd:ee:ff',
      },
      ssh: {
        keyPath: '/key-path',
        user: 'username',
      }
    };

    it('should return status for connectivity success', async () => {
      // given
      sshExecMock.mockResolvedValue({
        code: 0,
        stderr: '',
        stdout: 'command result',
        signal: null,
      });

      // when
      const actual = await sshDiag('0', defaultDeviceConfig);

      // then
      expect(actual).toEqual({
        status: 'ok',
      });
    });

    it('should return status for lack of SSH settings', async () => {
      // given
      const deviceConfig: DeviceConfig = {
        ...defaultDeviceConfig,
        ssh: undefined,
      };

      // when
      const actual = await sshDiag('0', deviceConfig);

      // then
      expect(sshExecMock).not.toHaveBeenCalled();
      expect(actual).toEqual({
        message: 'Device with id=0 has no configured SSH capability.',
        status: 'n/a',
      });
    });

    it('should return status for SSH failure', async () => {
      // given
      sshExecMock.mockRejectedValue({ message: 'SSH error', name: 'error-name', stack: 'error-stack' } as Error);

      // when
      const actual = await sshDiag('0', defaultDeviceConfig);

      // then
      expect(actual).toEqual({
        data: {
          message: 'SSH error',
          name: 'error-name',
          stack: 'error-stack',
        },
        message: 'SSH error',
        status: 'ko',
      });
    });

  });
});
