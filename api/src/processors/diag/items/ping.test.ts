import { pingDiag } from './ping';
import { ping as sgPing } from '../../../helpers/systemGateway';
import { FeatureStatus } from '../../../models/common';
import { PING_OK_SAMPLE_50_LOSS, PING_OK_SAMPLE_0_LOSS, PING_OK_SAMPLE_100_LOSS, PING_OK_SAMPLE_UNEXPECTED } from './test-resources/pingOutputSamples';

import type { DeviceConfig } from '../../../models/configuration';
import type { SysCommandOutput } from '../../../helpers/systemGateway';

jest.mock('../../../helpers/systemGateway');

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

    it('should invoke systemGateway to call ping command when success (0% packet loss)', async () => {
      // given
      const gatewayResponse: SysCommandOutput = {
        standardOutput: PING_OK_SAMPLE_0_LOSS,
        status: FeatureStatus.OK,
      };
      sgPingMock.mockResolvedValue(gatewayResponse);
      
      // when
      const actual = await pingDiag('0', deviceConfig);

      // then
      expect(actual).toEqual({
        data: {
          packetLossRate: 0,
          roundTripTimeMs: {
            average: 0.154,
            max: 0.184,
            min: 0.125,
            standardDeviation: 0.029,
          },
        },
        status: 'ok',
      });
    });

    it('should invoke systemGateway to call ping command when success (50% packet loss)', async () => {
      // given
      const gatewayResponse: SysCommandOutput = {
        standardOutput: PING_OK_SAMPLE_50_LOSS,
        status: FeatureStatus.OK,
      };
      sgPingMock.mockResolvedValue(gatewayResponse);
      
      // when
      const actual = await pingDiag('0', deviceConfig);

      // then
      expect(actual).toEqual({
        data: {
          packetLossRate: 0.5,
          roundTripTimeMs: {
            average: 0.154,
            max: 0.184,
            min: 0.125,
            standardDeviation: 0.029,
          },
        },
        status: 'ok',
      });
    });

    it('should invoke systemGateway to call ping command when success (100% packet loss)', async () => {
      // given
      const gatewayResponse: SysCommandOutput = {
        standardOutput: PING_OK_SAMPLE_100_LOSS,
        status: FeatureStatus.OK,
      };
      sgPingMock.mockResolvedValue(gatewayResponse);
      
      // when
      const actual = await pingDiag('0', deviceConfig);

      // then
      expect(actual).toEqual({
        data: {
          packetLossRate: 1,
          roundTripTimeMs: {
            average: 0,
            max: 0,
            min: 0,
            standardDeviation: 0,
          },
        },
        status: 'ok',
      });
    });

    it('should invoke systemGateway to call ping command when success (unexpected output)', async () => {
      // given
      const gatewayResponse: SysCommandOutput = {
        standardOutput: PING_OK_SAMPLE_UNEXPECTED,
        status: FeatureStatus.OK,
      };
      sgPingMock.mockResolvedValue(gatewayResponse);
      
      // when
      const actual = await pingDiag('0', deviceConfig);

      // then
      expect(actual).toEqual({
        data: {},
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
        message: 'an error occurred',
        status: 'ko',
      });
    });
  });
});
