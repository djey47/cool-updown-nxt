import { replyWithJson, replyWithItemNotFound } from '../../common/api';
import { AppContext } from '../../common/context';
import { getDefaultContext, getDefaultDeviceConfig, getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { FeatureStatus, PowerStatus } from '../../models/common';
import { diags, diagsForDevice } from './diags';
import { validateDeviceIdentifier } from '../common/validators';

import type { FastifyReply } from 'fastify/types/reply';
import type { DiagsResponse } from './models/diags';
import type { Context, DiagnosticsContext } from '../../models/context';
import type { DeviceConfig } from '../../models/configuration';
import { ApiItem } from '../../models/api';
import { LastPowerAttemptReason } from '../../processors/diag/models/diag';

jest.useFakeTimers();
const NOW = new Date();

jest.mock('../../common/api');
jest.mock('../../common/context');
jest.mock('../common/validators');

const replyWithJsonMock = replyWithJson as jest.Mock;
const replyWithItemNotFoundMock = replyWithItemNotFound as jest.Mock;
const contextGetMock = AppContext.get as jest.Mock<Context, []>; 
const validateDeviceIdentifierMock = validateDeviceIdentifier as jest.Mock<DeviceConfig, [string, FastifyReply]>;

const defaultDeviceConfig: DeviceConfig = getDefaultDeviceConfig();

beforeEach(() => {
  replyWithJsonMock.mockReset();
  replyWithItemNotFoundMock.mockReset();
  contextGetMock.mockReset();
  validateDeviceIdentifierMock.mockReset();

  validateDeviceIdentifierMock.mockReturnValue({ ...defaultDeviceConfig });
});

describe('diags service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);
  const defaultContext = getDefaultContext();

  const defaultDiags: DiagnosticsContext = {
    '0': {
      on: NOW,
      ping: {
        status: FeatureStatus.OK,
        data: {
          packetLossRate: 0.5,
          roundTripTimeMs: {
            average: 2,
            max: 3,
            min: 1,
            standardDeviation: 1,  
          },
        },
      },
      power: {
        state: PowerStatus.ON,
        lastStartAttempt: {
          reason: LastPowerAttemptReason.NONE,
        },
        lastStopAttempt: {
          reason: LastPowerAttemptReason.NONE,
        },
      },
      ssh: {
        status: FeatureStatus.OK,
      },
      http: {
        status: FeatureStatus.OK,
        data: {
          statusCode: 200,
          url: 'http://my-nas:5000',
        }
      },
    },
    '1': {
      on: NOW,
      ping: {
        status: FeatureStatus.KO
      },
      power: {
        state: PowerStatus.OFF,
        lastStartAttempt: {
          reason: LastPowerAttemptReason.NONE,
        },
        lastStopAttempt: {
          reason: LastPowerAttemptReason.NONE,
        },
      },
      ssh: {
        status: FeatureStatus.KO,
      },
      http: {
        status: FeatureStatus.KO,
      },
    },
  };

  describe('diags async function', () => {
    it('should send current diags results for all devices', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
        diagnostics: defaultDiags,
      });

      // when
      await diags(defaultReply);

      // then
      const expectedOutput: DiagsResponse = {
        diagnostics: {
          '0': {
            on: NOW,
            ping: {
              status: FeatureStatus.OK,
              data: {
                packetLossRate: 0.5,
                roundTripTimeMs: {
                  average: 2,
                  max: 3,
                  min: 1,
                  standardDeviation: 1,  
                },      
              },
            },
            power: {
              state: PowerStatus.ON,
              lastStateChangeReason: LastPowerAttemptReason.NONE,
            },
            ssh: {
              status: FeatureStatus.OK,
            },
            http: {
              status: FeatureStatus.OK,
              data: {
                statusCode: 200,
                url: 'http://my-nas:5000',
              },
            },
          },
          '1': {
            on: NOW,
            ping: {
              status: FeatureStatus.KO,
            },
            power: {
              state: PowerStatus.OFF,
              lastStateChangeReason: LastPowerAttemptReason.NONE,
            },
            ssh: {
              status: FeatureStatus.KO,
            },
            http: {
              status: FeatureStatus.KO,
            },
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);

    });
  });

  describe('diagsForDevice async function', () => {
    it('should send current diags result for specified device', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
        diagnostics: defaultDiags,
      });

      // when
      await diagsForDevice('0', defaultReply);

      // then
      const expectedOutput: DiagsResponse = {
        diagnostics: {
          on: NOW,
          ping: {
            status: FeatureStatus.OK,
            data: {
              packetLossRate: 0.5,
              roundTripTimeMs: {
                average: 2,
                max: 3,
                min: 1,
                standardDeviation: 1,  
              },      
            },
          },
          power: {
            state: PowerStatus.ON,
            lastStateChangeReason: LastPowerAttemptReason.NONE,
          },
          ssh: {
            status: FeatureStatus.OK,
          },
          http: {
            status: FeatureStatus.OK,
            data: {
              statusCode: 200,
              url: 'http://my-nas:5000',
            },
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should send current diags result for specified device, when power state is unavailable', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
        diagnostics: {
          ...defaultDiags,
          '0': {
            ...defaultDiags['0'],
            power: {
              ...defaultDiags['0'].power,
              state: PowerStatus.UNAVAILABLE,
            },
          },  
        },
      });

      // when
      await diagsForDevice('0', defaultReply);

      // then
      const expectedOutput: DiagsResponse = {
        diagnostics: {
          on: NOW,
          ping: {
            status: FeatureStatus.OK,
            data: {
              packetLossRate: 0.5,
              roundTripTimeMs: {
                average: 2,
                max: 3,
                min: 1,
                standardDeviation: 1,  
              },      
            },
          },
          power: {
            state: PowerStatus.UNAVAILABLE,
            lastStateChangeReason: LastPowerAttemptReason.NONE,
          },
          ssh: {
            status: FeatureStatus.OK,
          },
          http: {
            status: FeatureStatus.OK,
            data: {
              statusCode: 200,
              url: 'http://my-nas:5000',
            },
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should reply with 404 when no configuration for specified device', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
        diagnostics: defaultDiags,
      });
      validateDeviceIdentifierMock.mockReset();
      
      // when
      await diagsForDevice('foo', defaultReply);

      // then
      expect(validateDeviceIdentifierMock).toHaveBeenCalledWith('foo', defaultReply);
      expect(replyWithJsonMock).not.toHaveBeenCalled();
      expect(replyWithItemNotFoundMock).not.toHaveBeenCalled();
    });

    it('should reply with 404 when no diags for specified device', async () => {
      // given
      contextGetMock.mockReturnValue({
        ...defaultContext,
        diagnostics: defaultDiags,
      });
      validateDeviceIdentifierMock.mockReturnValue({ ...defaultDeviceConfig });

      // when
      await diagsForDevice('foo', defaultReply);

      // then
      expect(replyWithJsonMock).not.toHaveBeenCalled();
      expect(replyWithItemNotFoundMock).toHaveBeenCalledWith(defaultReply, ApiItem.DEVICE_ID_DIAGS, 'foo');
    });
  });
});
