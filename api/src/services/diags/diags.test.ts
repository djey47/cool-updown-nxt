import { replyWithJson, replyWithItemNotFound } from '../../common/api';
import { AppContext } from '../../common/context';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { FeatureStatus, PowerStatus } from '../../models/common';
import { diags, diagsForDevice } from './diags';
import { ApiItem } from '../../models/api';

import type { DiagsResponse } from './models/diags';
import type { DiagnosticsContext } from '../../models/context';
import { LastPowerAttemptReason } from '../../processors/diag/models/diag';

jest.useFakeTimers();
const NOW = new Date();

jest.mock('../../common/api');
const replyWithJsonMock = replyWithJson as jest.Mock;
const replyWithItemNotFoundMock = replyWithItemNotFound as jest.Mock;

beforeEach(() => {
  replyWithJsonMock.mockReset();
  replyWithItemNotFoundMock.mockReset();
  AppContext.resetAll();
});

describe('diags service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

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
    },
  };

  describe('diags async function', () => {
    it('should send current diags results for all devices', async () => {
      // given
      const appContext = AppContext.get();
      appContext.diagnostics = defaultDiags;

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
              lastStartAttemptReason: LastPowerAttemptReason.NONE,
              lastStopAttemptReason: LastPowerAttemptReason.NONE,
            },
            ssh: {
              status: FeatureStatus.OK,
            },
          },
          '1': {
            on: NOW,
            ping: {
              status: FeatureStatus.KO,
            },
            power: {
              state: PowerStatus.OFF,
              lastStartAttemptReason: LastPowerAttemptReason.NONE,
              lastStopAttemptReason: LastPowerAttemptReason.NONE,
            },
            ssh: {
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
      const appContext = AppContext.get();
      appContext.diagnostics = defaultDiags;

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
            lastStartAttemptReason: LastPowerAttemptReason.NONE,
            lastStopAttemptReason: LastPowerAttemptReason.NONE,
          },
          ssh: {
            status: FeatureStatus.OK,
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);
    });

    it('should reply with 404 when no diags for specified device', async () => {
      // given
      const appContext = AppContext.get();
      appContext.diagnostics = defaultDiags;

      // when
      await diagsForDevice('foo', defaultReply);

      // then
      expect(replyWithJsonMock).not.toHaveBeenCalled();
      expect(replyWithItemNotFoundMock).toHaveBeenCalledWith(defaultReply, ApiItem.DEVICE_ID, 'foo');
    });
  });
});
