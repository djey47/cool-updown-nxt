import subSeconds from 'date-fns/subSeconds';
import { replyWithJson } from '../../common/api';
import { AppContext } from '../../common/context';
import { getMockedFastifyReply } from '../../helpers/testing/mockObjects';
import { FeatureStatus, PowerStatus } from '../../models/common';
import { diags } from './diags';

import type { DiagsResponse } from './models/diags';

jest.useFakeTimers();
const NOW = new Date();
const NOW_MINUS_1MIN = subSeconds(NOW, 60);

jest.mock('../../common/api');
const replyWithJsonMock = replyWithJson as jest.Mock;

beforeEach(() => {
  replyWithJsonMock.mockReset();
});

describe('diags service', () => {
  const codeMock = jest.fn();
  const sendMock = jest.fn();
  const defaultReply = getMockedFastifyReply(codeMock, sendMock);

  describe('diags async function', () => {
    it('should send current diags results for all devices', async () => {
      // given
      const appContext = AppContext.get();
      appContext.diagnostics = {
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
          },
        },
      };

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
            },
          },
        },
      };
      expect(replyWithJsonMock).toHaveBeenCalledWith(defaultReply, expectedOutput);

    });
  });
});
