import { pingDiag } from './ping';
import { ping as sgPing } from '../../../helpers/systemGateway';
import { FeatureStatus } from '../../../models/common';

import type { DeviceConfig } from '../../../models/configuration';
import type { SysCommandOutput } from '../../../helpers/systemGateway';

jest.mock('../../../helpers/systemGateway');

jest.useFakeTimers();
const NOW = new Date();

const sgPingMock = sgPing as jest.Mock<Promise<SysCommandOutput>>;

describe('ping diag item', () => {
  describe('pingDiag function', () => {
    const deviceConfig: DeviceConfig = {
      network: {
        broadcastIpAddress: '255.255.255.255',
        hostname: 'host-name',
        macAddress: 'aa:bb:cc:dd:ee:ff',
      },
    };

    it('should invoke systemGateway to call ping command when success', async () => {
      // given
      const gatewayResponse: SysCommandOutput = {
        standardOutput: '',
        status: FeatureStatus.OK,
      };
      sgPingMock.mockResolvedValue(gatewayResponse);
      
      // when
      const actual = await pingDiag('0', deviceConfig);

      // then
      expect(actual).toEqual({
        on: NOW,
        status: 'ok',
      });
    });

    it('should handle failure from systemGateway', async () => {
      // given
      const gatewayResponse: SysCommandOutput = {
        error: new Error('error'),
        errorOutput: 'an error occurred',
        standardOutput: '',
        status: FeatureStatus.KO,
      };
      sgPingMock.mockResolvedValue(gatewayResponse);
      
      // when
      const actual = await pingDiag('0', deviceConfig);

      // then
      expect(actual).toEqual({
        on: NOW,
        message: 'an error occurred',
        status: 'ko',
      });
    });
  });
});
