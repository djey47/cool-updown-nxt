import subSeconds from 'date-fns/subSeconds';
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
const NOW_MINUS_1MIN = subSeconds(NOW, 60);

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
        current: {
          on: NOW,
          status: FeatureStatus.OK
        },
        previous: {
          on: NOW_MINUS_1MIN,
          status: FeatureStatus.KO,
        }
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
    },
    '1': {
      on: NOW,
      ping: {
        current: {
          on: NOW,
          status: FeatureStatus.KO
        },
        previous: {
          on: NOW_MINUS_1MIN,
          status: FeatureStatus.OK,
        }
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
              on: NOW,
              status: FeatureStatus.OK,
            },
            power: {
              state: PowerStatus.ON,
              lastStartAttemptReason: LastPowerAttemptReason.NONE,
              lastStopAttemptReason: LastPowerAttemptReason.NONE,
            },
          },
          '1': {
            on: NOW,
            ping: {
              on: NOW,
              status: FeatureStatus.KO,
            },
            power: {
              state: PowerStatus.OFF,
              lastStartAttemptReason: LastPowerAttemptReason.NONE,
              lastStopAttemptReason: LastPowerAttemptReason.NONE,
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
            on: NOW,
            status: FeatureStatus.OK,
          },
          power: {
            state: PowerStatus.ON,
            lastStartAttemptReason: LastPowerAttemptReason.NONE,
            lastStopAttemptReason: LastPowerAttemptReason.NONE,
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
      expect(replyWithItemNotFound).toHaveBeenCalledWith(defaultReply, ApiItem.DEVICE_ID, 'foo');
    });
  });
});
