import { httpDiag } from './http';
import resetMocks from '../../../../config/jest/resetMocks';
import globalMocks from '../../../../config/jest/globalMocks';

import type { DeviceConfig } from '../../../models/configuration';

const { nodefetchMock } = globalMocks;

beforeEach(() => {
  resetMocks();
});

describe('http diag item', () => {
  describe('httpDiag function', () => {
    const defaultDeviceConfig: DeviceConfig = {
      network: {
        broadcastIpAddress: '255.255.255.255',
        hostname: 'host-name',
        macAddress: 'aa:bb:cc:dd:ee:ff',
      },
      ssh: {
        keyPath: '/key-path',
        user: 'username',
      },
      http: {
        url: 'http://my-nas:5000',
      },
    };

    it('should return status for HTTP success', async () => {
      // given
      nodefetchMock.mockResolvedValue({
        status: 200,
      });

      // when
      const actual = await httpDiag('0', defaultDeviceConfig);

      // then
      expect(nodefetchMock).toHaveBeenCalledWith('http://my-nas:5000');
      expect(actual).toEqual({
        status: 'ok',
        data: {
          statusCode: 200,
          url: 'http://my-nas:5000',
        },
      });
    });

    it('should return status for HTTP 400', async () => {
      // given
      nodefetchMock.mockResolvedValue({
        status: 400,
        statusText: 'error',
      });

      // when
      const actual = await httpDiag('0', defaultDeviceConfig);

      // then
      expect(nodefetchMock).toHaveBeenCalledWith('http://my-nas:5000');
      expect(actual).toEqual({
        status: 'ko',
        data: {
          statusCode: 400,
          url: 'http://my-nas:5000',
        },
        message: 'error',
      });
    });

    it('should return status for lack of HTTP settings', async () => {
      // given
      const deviceConfig: DeviceConfig = {
        ...defaultDeviceConfig,
        http: undefined,
      };

      // when
      const actual = await httpDiag('0', deviceConfig);

      // then
      expect(nodefetchMock).not.toHaveBeenCalled();
      expect(actual).toEqual({
        message: 'Device with id=0 has no configured HTTP capability.',
        status: 'n/a',
      });
    });

    it('should return status for HTTP failure', async () => {
      // given
      nodefetchMock.mockRejectedValue({ message: 'HTTP error', name: 'error-name', stack: 'error-stack' } as Error);

      // when
      const actual = await httpDiag('0', defaultDeviceConfig);

      // then
      expect(actual).toEqual({
        data: {
          message: 'HTTP error',
          name: 'error-name',
          stack: 'error-stack',
          url: 'http://my-nas:5000'
        },
        message: 'HTTP error',
        status: 'ko',
      });
    });

  });
});
